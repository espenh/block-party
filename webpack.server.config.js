const { CheckerPlugin } = require('awesome-typescript-loader')
const fs = require('fs');

const nodeModules = {};

fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });


module.exports = {
    entry: "./src/server/serverStartup.ts",
    output: {
        filename: "serverApp.js",
        path: __dirname + "/dist",
        publicPath: "/dist"
    },
    target: "node",
    externals: nodeModules,
    node: {
        __dirname: false /* Normal node __dirname */
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: 'pre', test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ]
};
