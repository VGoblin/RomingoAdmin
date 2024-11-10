import { useState } from 'react'
import { EnvContext } from './tools/EnvContext'
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

export const EnvContextWrapper = ({ children }) => {
  const [productionEnv, setProductionEnv] = useState(localStorage.getItem('productionEnv') === 'true' ? true : false )

  /**
   * TODO: fixed this using different environment pipline file.
   */
  const client = new ApolloClient({
    // uri: productionEnv ? 'https://graphql.romingo.com/graphql' : 'https://dev.graphql.romingo.com/graphql',
    uri: 'https://graphql.romingo.com/graphql',
    // uri: 'https://dev.graphql.romingo.com/graphql',
    // uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache({
    }),
    connectToDevTools: true,
  });

  return <EnvContext.Provider value={[productionEnv, setProductionEnv]}>
    <ApolloProvider client={client}>
      { children }
    </ApolloProvider>
  </EnvContext.Provider>
}
