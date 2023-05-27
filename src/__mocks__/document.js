import { JSDOM } from 'jsdom';

const dom = new JSDOM(`
<svg>
    <Text id="cryptoElement" style="fill:red;"></Text>
</svg>
`,{
    contentType: "text/xml"
});

export default dom.window.document;
