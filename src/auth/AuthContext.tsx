import { createContext, useContext, useState } from "react";

export type Role = "internal" | "customer";

export type User = {
  id: string;
  role: Role;
  customerId?: string;
  email?: string;
};

type AuthContextValue = {
  user: User | null;
  loginAsInternal: () => void;
  loginAsCustomer: (customerId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Mock auth — Zoho Catalyst will replace this later
  const loginAsInternal = () => {
    setUser({
      id: "internal-1",
      role: "internal",
      email: "csm@company.com",
    });
  };

  const loginAsCustomer = (customerId: string) => {
    setUser({
      id: `customer-${customerId}`,
      role: "customer",
      customerId,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, loginAsInternal, loginAsCustomer, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}