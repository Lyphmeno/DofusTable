export type Profile = {
  id: string;
  username: string;
  createdAt: string;
};

export type ProfileRow = {
  id: string;
  username: string;
  created_at: string;
};

export const mapProfileRow = (row: ProfileRow): Profile => {
  return {
    id: row.id,
    username: row.username,
    createdAt: row.created_at
  };
};
