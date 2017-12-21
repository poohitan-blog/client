export default (props) => {
  const markup = { __html: props.body };

  return <div>
    <div dangerouslySetInnerHTML={markup}/>
  </div>
};
