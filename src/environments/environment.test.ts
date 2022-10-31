export const environment = {
  production: true,
  testEnvironment: {
    flag: true,
    access: {
      login: 'ZGV2QGthemdpc2E=',
      passcode: 'UXdlcnR5MTIj'
    }
  },
  project: {
    urls: {
      default: {
        es: 'http://e-jambyl.kazgisa.kz',
        bp: 'https://bp.e-jambyl.kazgisa.kz',
        dm: 'http://dm.e-jambyl.kazgisa.kz',
        sb: 'http://sb.e-jambyl.kazgisa.kz',
        geo: 'http://geo.e-jambyl.kazgisa.kz'
      },
      production: {
        es: 'https://e-jambyl.kz',
        bp: 'https://bp.e-jambyl.kz',
        dm: 'https://dm.e-jambyl.kz',
        sb: 'https://sb.e-jambyl.kz',
        geo: 'https://geo.e-jambyl.kz'
      }
    }
  }
};
