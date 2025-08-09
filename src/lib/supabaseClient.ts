import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

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
    // 首先创建投票
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert([{
        title: input.title,
        description: input.description,
        is_multiple: input.is_multiple,
        expires_at: input.expires_at,
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

    // 返回完整的投票数据
    return {
      ...pollData,
      options: optionsResult,
    };
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
  async getPolls(): Promise<Poll[]> {
    const { data, error } = await supabase
      .from('polls')
      .select('*, options:poll_options(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 投票
  async vote(pollId: string, optionId: string, userId?: string): Promise<Vote> {
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
};
