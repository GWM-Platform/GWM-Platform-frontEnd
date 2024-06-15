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
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/, // Selecciona solo los módulos dentro de node_modules
                name(module) {
                    // Obtiene el nombre del paquete. Por ejemplo, node_modules/packageName/not/this/part.js
                    // se convertirá en 'npm.packageName'
                    const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                    return `npm.${packageName.replace('@', '')}`;
                },
                priority: -10 // Prioridad para este grupo de caché
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    };

    return config;
};
