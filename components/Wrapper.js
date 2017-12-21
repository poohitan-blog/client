import Header from './Header';
import Content from './Content';

export default (props) => (
  <div className="wrapper">
    <Header/>

    <Content>
      {props.children}
    </Content>
  </div>
)
