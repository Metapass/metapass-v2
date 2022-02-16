import axios from "axios";
export const getAllEnsLinked = async (address: string) => {
    const headers = {
      "content-type": "application/json",
    };
    const ensGraphURL = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
    const graphqlQuery = {
      operationName: "fetchEns",
      // variables: {},
      query: `query fetchEns {
            domains(where:{owner:"${address.toLowerCase()}"}){
              name
              labelName
              id      
            }
          }
      `,
    };
  
    const res = await axios({
      url: ensGraphURL,
      method: "POST",
      data: graphqlQuery,
      headers,
    });
  
    if (!!res.data?.errors?.length) {
      throw new Error("Error fetching ens domains");
    }
  
    return res.data;
  };