export const environment = {
  production: true,
  testEnvironment: {
    flag: false,
    access: {
      login: null,
      passcode: null
    }
  },
  project: {
    urls: {
      default: {
        es: 'https://e-jambyl.kz',
        bp: 'https://bp.e-jambyl.kz',
        dm: 'https://dm.e-jambyl.kz',
        sb: 'https://sb.e-jambyl.kz',
        geo: 'https://geo.e-jambyl.kz'
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
