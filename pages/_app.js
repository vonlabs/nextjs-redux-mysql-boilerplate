import { wrapper } from '../utils/reduxStore'

const App = ({ Component, pageProps }) => {
    return (
        <Component 
            {...pageProps}
        />
    )
}
//https://github.com/vercel/next.js/blob/95c2e57e77afaae73040a43baf8df41924fac0b4/examples/with-cookie-auth/pages/profile.js
export default wrapper.withRedux(App)