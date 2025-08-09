import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// 生成UUID v4格式的ID
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 验证UUID格式
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// 清理localStorage中的无效数据
const cleanupInvalidData = (): void => {
  const cleanupKeys = [];
  
  // 检查所有localStorage项
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      // 检查用户ID相关的键
      if (key === 'user-id') {
        const value = localStorage.getItem(key);
        if (value && !isValidUUID(value)) {
          cleanupKeys.push(key);
        }
      }
      // 检查投票相关的键，如果关联到无效用户ID也清理
      else if (key.startsWith('poll-voted-') || key.startsWith('poll-option-') || key === 'current-user-id') {
        const userId = localStorage.getItem('user-id');
        if (userId && !isValidUUID(userId)) {
          cleanupKeys.push(key);
        }
      }
    }
  }
  
  // 清理无效的键
  cleanupKeys.forEach(key => {
    console.warn(`清理无效的localStorage项: ${key}`);
    localStorage.removeItem(key);
  });
};

// 获取或生成用户ID
export const getUserId = (): string => {
  // 先执行一次性清理
  cleanupInvalidData();
  
  const existingId = localStorage.getItem('user-id');
  
  // 如果存在ID但格式不正确，清除并重新生成
  if (existingId && !isValidUUID(existingId)) {
    console.warn('检测到无效的用户ID格式，重新生成:', existingId);
    localStorage.removeItem('user-id');
  }
  
  // 如果没有有效ID或ID格式无效，生成新的
  if (!existingId || !isValidUUID(existingId)) {
    const newId = generateUUID();
    localStorage.setItem('user-id', newId);
    console.log('生成新的用户ID:', newId);
    return newId;
  }
  
  return existingId;
};

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// 投票数据类型定义
export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  creator_id?: string;
  is_multiple: boolean; // 是否多选
  expires_at?: string; // 有效期
  is_public: boolean; // 是否公开
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  vote_count: number;
  created_at: string;
}

// 创建投票的输入类型
export interface CreatePollInput {
  title: string;
  description?: string;
  is_multiple: boolean;
  expires_at?: string;
  creator_id?: string;
  is_public: boolean; // 是否公开
  options: string[]; // 选项文本数组
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id?: string;
  created_at: string;
}

// Realtime 订阅类型
export type RealtimeChannel = ReturnType<typeof supabase.channel>;

// 投票相关的 API 方法
export const pollsApi = {
  // 创建投票
  async createPoll(input: CreatePollInput): Promise<Poll> {
    try {
      // 首先创建投票
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert([{
          title: input.title,
          description: input.description,
          is_multiple: input.is_multiple,
          expires_at: input.expires_at,
          creator_id: input.creator_id,
          is_public: input.is_public,
          is_active: true,
        }])
        .select()
        .single();

      if (pollError) throw pollError;

      // 然后创建选项
      const optionsData = input.options.map(optionText => ({
        poll_id: pollData.id,
        text: optionText,
        vote_count: 0,
      }));

      const { data: optionsResult, error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsData)
        .select();

      if (optionsError) throw optionsError;

      // 返回完整的投票数据，确保 options 是数组
      return {
        ...pollData,
        options: optionsResult || [],
      };
    } catch (error) {
      console.error('创建投票失败:', error);
      throw error;
    }
  },

  // 获取投票详情
  async getPoll(id: string): Promise<Poll | null> {
    const { data, error } = await supabase
      .from('polls')
      .select('*, options:poll_options(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // 获取所有投票
  async getPolls(publicOnly: boolean = true): Promise<Poll[]> {
    let query = supabase
      .from('polls')
      .select('*, options:poll_options(*)')
      .order('created_at', { ascending: false });

    // 如果只获取公开投票，添加过滤条件
    if (publicOnly) {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // 投票
  async vote(pollId: string, optionId: string, userId?: string): Promise<Vote> {
    // 首先检查用户是否已经投票过
    if (userId) {
      const { data: existingVotes } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .limit(1);
      
      if (existingVotes && existingVotes.length > 0) {
        throw new Error('您已经投票过了');
      }
    }

    const { data, error } = await supabase
      .from('votes')
      .insert([{
        poll_id: pollId,
        option_id: optionId,
        user_id: userId,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 检查用户是否已投票
  async hasUserVoted(pollId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      throw error;
    }
    
    return data && data.length > 0;
  },

  // 订阅投票实时更新
  subscribeToVotes(pollId: string, callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel(`votes:poll_id=eq.${pollId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${pollId}`,
        },
        callback
      )
      .subscribe();
  },

  // 取消订阅
  async unsubscribe(channel: RealtimeChannel): Promise<void> {
    await supabase.removeChannel(channel);
  },

  // 获取投票结果（包含实时统计数据）
  async getPollResults(pollId: string): Promise<{
    poll: Poll;
    totalVotes: number;
    results: Array<{
      id: string;
      text: string;
      votes: number;
      percentage: number;
    }>;
  } | null> {
    try {
      // 获取投票基本信息和选项
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .select(`
          *,
          options:poll_options(*)
        `)
        .eq('id', pollId)
        .single();

      if (pollError) throw pollError;
      if (!poll) return null;

      // 获取每个选项的投票数
      const { data: voteData, error: voteError } = await supabase
        .from('votes')
        .select('option_id')
        .eq('poll_id', pollId);

      if (voteError) throw voteError;

      // 统计各选项的投票数
      const voteCounts: { [key: string]: number } = {};
      voteData?.forEach(vote => {
        voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
      });

      const totalVotes = voteData?.length || 0;

      // 生成结果数据
      const results = poll.options.map((option: PollOption) => ({
        id: option.id,
        text: option.text,
        votes: voteCounts[option.id] || 0,
        percentage: totalVotes > 0 ? ((voteCounts[option.id] || 0) / totalVotes) * 100 : 0,
      }));

      return {
        poll,
        totalVotes,
        results,
      };
    } catch (error) {
      console.error('获取投票结果失败:', error);
      throw error;
    }
  },

  // 检查投票是否已过期
  isPollExpired(poll: Poll): boolean {
    if (!poll.expires_at) return false;
    return new Date(poll.expires_at) < new Date();
  },
};
