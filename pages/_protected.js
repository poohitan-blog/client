import AuthenticatablePage from './_authenticatable';

class ProtectedPage extends AuthenticatablePage {
  static async getInitialProps({ req }) {
    const parentProps = await super.getInitialProps({ req });

    if (!parentProps.isAuthenticated) {
      return { error: { status: 401 } };
    }

    return parentProps;
  }
}

export default ProtectedPage;
