import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import API from '../../services/api';
import Error from '../_error';
import { current } from '../../config';
import { getAllCookies } from '../../services/cookies';

import ProtectedPage from '../mixins/protected';
import Wrapper from '../../components/Wrapper';
import Header from '../../components/Header';
import Content from '../../components/Content';
import Footer from '../../components/Footer';
import RedirectForm from '../../components/admin/RedirectForm';

class RedirectsPage extends ProtectedPage {
  static async getInitialProps({ query, req }) {
    try {
      const parentProps = await super.getInitialProps({ query, req });
      const { docs } = await API.redirects.find({}, getAllCookies(req));

      return Object.assign(parentProps, { redirects: docs });
    } catch (error) {
      return { error };
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      redirects: props.redirects,
    };

    this.save = this.save.bind(this);
    this.createRedirect = this.createRedirect.bind(this);
    this.updateRedirect = this.updateRedirect.bind(this);
    this.removeRedirect = this.removeRedirect.bind(this);
  }

  async createRedirect() {
    // if (!redirect.from || !redirect.to || redirect.from === redirect.to) {
    //   // return; // TODO: show error
    // }

    return API.redirects.create(this.state.newRedirect, getAllCookies());
  }

  updateRedirect(redirectToUpdate) {
    const { redirects } = this.state;
    const redirectsIds = redirects.map(redirect => redirect.id);
    const indexOfRedirectToUpdate = redirectsIds.indexOf(redirectToUpdate.id);

    this.setState({
      redirects: [
        ...redirects.slice(0, indexOfRedirectToUpdate),
        redirectToUpdate,
        ...redirects.slice(indexOfRedirectToUpdate + 1),
      ],
    });
  }

  removeRedirect(redirectToRemove) {
    const { redirects } = this.state;
    const redirectsIds = redirects.map(redirect => redirect.id);
    const indexOfRedirectToRemove = redirectsIds.indexOf(redirectToRemove.id);

    this.setState({
      redirects: [
        ...redirects.slice(0, indexOfRedirectToRemove),
        ...redirects.slice(indexOfRedirectToRemove + 1),
      ],
    });
  }

  async save() {
    const updatedRedirectsIdsList = this.state.redirects.map(redirect => redirect.id);
    const redirectsToRemove = this.props.redirects
      .filter(redirect => !updatedRedirectsIdsList.includes(redirect.id));

    return Promise.all([
      this.state.redirects.map(redirect => API.redirects.update(redirect.id, redirect, getAllCookies())),
      redirectsToRemove.map(redirect => API.redirects.remove(redirect.id, getAllCookies())),
    ]);
  }

  render() {
    if (this.props.error) {
      return <Error statusCode={this.props.error.status} />;
    }

    return (
      <Wrapper>
        <Head>
          <title>Переадресування - {current.meta.title}</title>
        </Head>
        <Header />
        <Content>
          <h1>Переадресування</h1>
          <div className="children-equal-margin-vertical">
            <RedirectForm
              key="newRedirect"
              onChange={redirect => this.setState({ newRedirect: redirect })}
            />
            <div className="flex-100 layout-row layout-align-end-center margin-top">
              <button onClick={this.createRedirect}>Створити переадресування</button>
            </div>
            {
              Boolean(this.state.redirects.length) && this.state.redirects.map(redirect => (
                <div className="margin-top" key={redirect.id}>
                  <hr className="margin-bottom" />
                  <RedirectForm
                    {...redirect}
                    onChange={updatedRedirect => this.updateRedirect(updatedRedirect)}
                    onRemove={() => this.removeRedirect(redirect)}
                  />
                </div>
              ))
            }
            {
              Boolean(this.props.redirects.length) &&
              <div className="flex-100 layout-row layout-align-end-center margin-top">
                <button onClick={this.save}>Зберегти</button>
              </div>
            }
          </div>
        </Content>
        <Footer pagination={this.props.meta} />
      </Wrapper>
    );
  }
}

RedirectsPage.propTypes = {
  redirects: PropTypes.arrayOf(PropTypes.object).isRequired,

  error: PropTypes.shape({
    status: PropTypes.number,
  }),
};

RedirectsPage.defaultProps = {
  error: null,
};

export default RedirectsPage;
