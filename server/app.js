import express from 'express';
import cors from 'cors';
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { resolvers } from './resolvers.js';
import { readFile } from 'node:fs/promises';
import { getUser } from './db/users.js';

const app = express();

// Allow Cross-Origin requests
app.use(cors(),express.json(), authMiddleware);

app.post('/login',handleLogin);

const typeDefs = await readFile('./schema.graphql', 'utf-8');

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();

/* Pass in the express req.auth into the apolloMiddleware (see below), so can can use this context in
 For OIC, we will use crypto to encrypt from front app and then decrypt in backend for the email address using this code:

    import crypto from 'crypto';

    let algorithm = 'aes256'; 
    let key = 'adasdsadsadsadsdfsdfdsfdsfsdsade'; // With aes256 must exactly 32 characters required below
    let text = 'rwilson@us.ibm.com';
    console.log('[text]:', text);
    let iv = "OICoicOICoic1234" // With aes256 must exactly 36 characters required below

    let cipher = crypto.createCipheriv(algorithm, key, iv);  
    let encrypted = `${cipher.update(text, 'utf8', 'hex')}${cipher.final('hex')}`;
    console.log('[encrypted]:', encrypted);
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = `${decipher.update(encrypted, 'hex', 'utf8')}${decipher.final('utf8')}`;
    console.log('[decrypted]:', decrypted);

*/

const getContext = async ({req}) => {
    if (req.auth) {
        const user = await getUser(req.auth.sub);
        return { user }
    } 
    return { }
}

app.use('/graphql',apolloMiddleware(apolloServer, { context: getContext}));
// This stops the Cannot find module 'ico' error, which happens when a new instance of a browser is initiated. 
// - this just declares the route so it's doesn't - no code functionality needed
app.get('/favico.ico' , function(req , res){/*code*/});

app.use((req, res) => {
    res.status(404).render(`Path- /${req.url} - not found`)
}
)
export default app;