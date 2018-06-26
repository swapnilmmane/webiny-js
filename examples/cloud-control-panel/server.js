const { spa } = require("webiny-scripts");

module.exports = spa.server({
    domain: "http://localhost",
    port: 8060,
    routes: {
        "/": "index.html"
    },
    devMiddleware: {
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
});
