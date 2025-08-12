export type RootStackParamList = {
  Game: { reset?: boolean } | undefined; // ⬅️ allow reset param
  Result: { winner?: 'X' | 'O'; isTie?: boolean } | undefined;
  Login: undefined;
  Stats: undefined;
  About: undefined;
};
