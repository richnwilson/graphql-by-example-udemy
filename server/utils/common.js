import { GraphQLError } from 'graphql';

const common = {
    graphQLError: (label,code) => {
        throw new GraphQLError(label, {
            extensions: {code}
        })
    }
}

export default common;