import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

interface SignUpData {
  email: string;
  phone: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  isPEP: boolean | null;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  password: string;
  pin: string;
}

interface SignUpContextValue {
  signUpData: SignUpData;
  updateSignUpData: (data: Partial<SignUpData>) => void;
  resetSignUpData: () => void;
}

const INITIAL_DATA: SignUpData = {
  email: '',
  phone: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  nationality: '',
  isPEP: null,
  country: '',
  address: '',
  city: '',
  postalCode: '',
  password: '',
  pin: '',
};

const SignUpContext = createContext<SignUpContextValue | undefined>(undefined);

export const SignUpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [signUpData, setSignUpData] = useState<SignUpData>(INITIAL_DATA);

  const updateSignUpData = useCallback((data: Partial<SignUpData>) => {
    setSignUpData(prev => ({ ...prev, ...data }));
  }, []);

  const resetSignUpData = useCallback(() => {
    setSignUpData(INITIAL_DATA);
  }, []);

  const value = useMemo<SignUpContextValue>(
    () => ({
      signUpData,
      updateSignUpData,
      resetSignUpData,
    }),
    [signUpData, updateSignUpData, resetSignUpData]
  );

  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = (): SignUpContextValue => {
  const context = useContext(SignUpContext);

  if (!context) {
    throw new Error('useSignUp must be used within SignUpProvider');
  }

  return context;
};
