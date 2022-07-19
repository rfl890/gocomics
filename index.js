const fastify = require('fastify')({ logger: false });
const configs = require("./config.json");
const getComicInfo = require("./getComicInfo.js");
fastify.register(require('@fastify/cors'), {});
fastify.route({
    method: 'GET',
    url: '/*',
    handler: async (request, reply) => {
        const gcurl = "https://www.gocomics.com" + request.url;
        const gocomicsInfo = await getComicUrl(gcurl);
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(gocomicsInfo);
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: configs.port, host: configs.listenAddress });
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}
start();
