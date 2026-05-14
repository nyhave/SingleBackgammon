import '@testing-library/jest-dom';

// Global Supabase Mock
// Global Supabase Mock
jest.mock('./supabaseClient', () => {
  return {
    supabase: {
      from: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockImplementation(() => ({
          order: jest.fn().mockImplementation(() => ({
            eq: jest.fn().mockImplementation(() => ({
              single: jest.fn().mockResolvedValue({ data: null, error: null })
            })),
            limit: jest.fn().mockResolvedValue({ data: [], error: null }),
            mockResolvedValue: jest.fn().mockResolvedValue({ data: [], error: null }),
            then: jest.fn().mockImplementation((callback) => Promise.resolve({ data: [], error: null }).then(callback))
          })),
          eq: jest.fn().mockImplementation(() => ({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
            select: jest.fn().mockResolvedValue({ data: [], error: null })
          })),
          insert: jest.fn().mockReturnThis(),
          update: jest.fn().mockReturnThis()
        }))
      })),
      channel: jest.fn().mockImplementation(() => ({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockReturnThis(),
        unsubscribe: jest.fn()
      }))
    }
  };
});
