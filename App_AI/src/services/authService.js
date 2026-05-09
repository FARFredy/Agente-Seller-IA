// src/services/authService.js
import { supabase } from '../utils/supabase';

export const authService = {

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return { user: data.user, session: data.session };
  },

  async register(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return { user: data.user };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  isAuthenticated() {
    return supabase.auth.getSession()
      .then(({ data }) => !!data.session);
  },
};