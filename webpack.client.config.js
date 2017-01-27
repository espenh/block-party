const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
    entry: "./src/client/clientStartup.tsx",
    output: {
        filename: "clientApp.js",
        path: __dirname + "/dist"
    },
    target: "web",

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