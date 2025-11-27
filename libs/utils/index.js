import _ from 'lodash';

class Utils {

    static setRoutes(config, defaultAuth) {
        let routes = [...config.routes];

        routes = routes.map(route => {
            let auth = config.auth || config.auth === null ? config.auth : defaultAuth || null;
            auth = route.auth || route.auth === null ? route.auth : auth;
            const settings = _.merge({}, config.settings, route.settings);

            return {
                ...route,
                settings,
                auth
            };
        });

        return [...routes];
    }

    static generateRoutesFromConfigs(configs, defaultAuth) {
        let allRoutes = [];
        configs.forEach(config => {
            allRoutes = [...allRoutes, ...this.setRoutes(config, defaultAuth)];
        });
        return allRoutes;
    }

}

export default Utils;