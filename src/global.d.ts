declare module 'scratchblocks';

type ImportMetaEnv = {
  readonly DEV: boolean;
};

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
