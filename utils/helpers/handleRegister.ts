import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { OpenLoginUserWithMetadata } from '../../hooks/useUser';
import { supabase } from '../../lib/config/supabaseConfig';

const handleRegister = async (
  user: User | null | OpenLoginUserWithMetadata,
  onOpen: () => void,
  setToOpen: any,
  event: string,
  address: string,
) => {
  if (user) {
    setToOpen(false);

    const { data, error } = await supabase
      .from('responses')
      .select('email')
      .eq('address', address)
      .eq('event', event);
    const { data: emailData, error: emailError } = await supabase
      .from('responses')
      .select('email')
      .eq('email', user.email)
      .eq('event', event);

    data?.length && emailData?.length !== 0
      ? toast.error("You've already filled the form")
      : onOpen();
  } else {
    setToOpen(true);
  }
};

export { handleRegister };
