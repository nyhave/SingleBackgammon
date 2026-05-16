import { supabase } from '../supabaseClient';

class ReportService {
  /**
   * Send manual user feedback
   */
  async sendFeedback(screen, message) {
    try {
      const { data, error } = await supabase
        .from('app_reports')
        .insert([
          { 
            type: 'feedback', 
            screen, 
            message,
            status: 'new'
          }
        ]);
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Kunne ikke gemme feedback:', err);
      throw err;
    }
  }

  /**
   * Automatically log an application error
   */
  async logError(screen, error) {
    try {
      const message = error.message || 'Ukendt fejl';
      const stack = error.stack || '';

      const trimmedMessage = message.trim();
      
      // Check for existing error to de-duplicate
      const { data: existing } = await supabase
        .from('app_reports')
        .select('*')
        .eq('type', 'error')
        .eq('screen', screen)
        .eq('message', trimmedMessage)
        .eq('status', 'new')
        .maybeSingle();

      if (existing) {
        // Increment count
        await supabase
          .from('app_reports')
          .update({ 
            count: (existing.count || 1) + 1,
            last_seen: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Create new
        await supabase
          .from('app_reports')
          .insert([
            {
              type: 'error',
              screen,
              message: trimmedMessage,
              stack_trace: stack,
              status: 'new'
            }
          ]);
      }
    } catch (err) {
      // Don't throw here to avoid infinite error loops
      console.error('Kunne ikke logge fejl til server:', err);
    }
  }

  /**
   * Log game start for statistics
   */
  async logGameStart(gameType) {
    try {
      await supabase
        .from('app_reports')
        .insert([{ 
          type: 'EVENT', 
          screen: 'select_game', 
          message: `GAME_START: ${gameType}`,
          status: 'info'
        }]);
    } catch (err) {
      console.error("Fejl ved logning af spilstart:", err);
    }
  }

  /**
   * Get all reports (Admin)
   */
  async getReports() {
    const { data, error } = await supabase
      .from('app_reports')
      .select('*')
      .order('last_seen', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  /**
   * Update report status (Admin)
   */
  async updateStatus(id, newStatus) {
    const { data, error } = await supabase
      .from('app_reports')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }

  /**
   * Delete report (Admin)
   */
  async deleteReport(id) {
    const { error } = await supabase
      .from('app_reports')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

const reportServiceInstance = new ReportService();
export default reportServiceInstance;
