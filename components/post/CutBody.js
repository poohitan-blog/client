import Link from 'next/link';

const CUT_TAG = '<cut>',
  READ_MORE = 'Читати повністю';

function cutBody(body) {
  const cutPosition = body.indexOf(CUT_TAG);

  return cutPosition > 0 ? body.slice(0, cutPosition) : body;
}

export default (props) => {
  const markup = { __html: cutBody(props.body) };

  return <div>
    <div dangerouslySetInnerHTML={markup}/>
    <Link as={props.path} href={`/post?path=${props.path}`}><a>{READ_MORE}</a></Link>
  </div>
};
