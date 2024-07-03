const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const { getProjectApplication } = require("@webiny/cli/utils");
const fs = require("fs");
const path = require("path");

module.exports = async options => {
    const { overrides, logs, cwd, debug } = options;

    let projectApplication;
    try {
        projectApplication = getProjectApplication({ cwd });
    } catch {
        // No need to do anything.
    }

    let webpackConfig = require("./webpack.config")({
        production: !debug,
        projectApplication,
        ...options
    });

    // Customize Webpack config.
    if (typeof overrides.webpack === "function") {
        webpackConfig = overrides.webpack(webpackConfig);
    }

    if (!fs.existsSync(webpackConfig.output.path)) {
        fs.mkdirSync(webpackConfig.output.path, { force: true });
    }

    fs.copyFileSync(
        path.join(__dirname, "wrappers", "watchCommand", "handler.js"),
        path.join(webpackConfig.output.path, webpackConfig.output.filename)
    );

    fs.copyFileSync(
        path.join(__dirname, "wrappers", "watchCommand", "mqtt.js"),
        path.join(webpackConfig.output.path, "mqtt.js")
    );

    webpackConfig.output.filename = `_${webpackConfig.output.filename}`;

    const webpack = require("webpack");

    return new Promise(async (resolve, reject) => {
        webpack(webpackConfig).run(async (err, stats) => {
            let messages = {};

            if (err) {
                messages = formatWebpackMessages({
                    errors: [err.message],
                    warnings: []
                });

                const errorMessages = messages.errors.join("\n\n");
                console.error(errorMessages);
                return reject(new Error(errorMessages));
            }

            if (stats.hasErrors()) {
                messages = formatWebpackMessages(
                    stats.toJson({
                        all: false,
                        warnings: true,
                        errors: true
                    })
                );
            }

            if (Array.isArray(messages.errors) && messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }

                const errorMessages = messages.errors.join("\n\n");
                console.error(errorMessages);
                reject(new Error(errorMessages));
                return;
            }

            logs && console.log(`Compiled successfully.`);
            resolve();
        });
    });
};
