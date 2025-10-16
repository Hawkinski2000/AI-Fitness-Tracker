export interface UserType {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  sex?: string | null;
  age?: string | null;
  height?: string | null;
  weight?: string | null;
  goal?: string | null;
}
