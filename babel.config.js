// /home/ali/workspace/babel.config.js
module.exports = {
    presets: [
        ['@babel/preset-env', { targets: 'defaults' }],
        ['@babel/preset-react', { runtime: 'automatic' }], // 👈 JSX support
    ],
};
