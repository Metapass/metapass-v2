export const gqlEndpoint =
  process.env.NEXT_PUBLIC_ENV === 'dev'
    ? 'https://api.thegraph.com/subgraphs/name/anoushk1234/metapass'
    : 'https://api.thegraph.com/subgraphs/name/anoushk1234/metapass-mainnet';
