const webpack = require("webpack")

module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        path: require.resolve("path-browserify"),
        url: require.resolve("url/")
    }
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    // Configuración de splitChunks para extraer paquetes específicos
    config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
    };

    return config;
};
