import React from 'react'
declare const window: any
class ChatwootWidget extends React.Component {
    componentDidMount() {
        // Add Chatwoot Settings
        window.chatwootSettings = {
            hideMessageBubble: false,
            position: 'right', // This can be left or right
            locale: 'en', // Language to be set
            type: 'standard', // [standard, expanded_bubble]
        }

        // Paste the script from inbox settings except the <script> tag
        ;(function (d, t) {
            var BASE_URL = 'https://app.chatwoot.com'
            var g: any = d.createElement(t),
                s: any = d.getElementsByTagName(t)[0]
            g.src = BASE_URL + '/packs/js/sdk.js'
            g.defer = true
            g.async = true
            s.parentNode.insertBefore(g, s)
            g.onload = function () {
                window.innerWidth > 720 &&
                    window.chatwootSDK.run({
                        websiteToken:
                            process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN,
                        baseUrl: BASE_URL,
                    })
            }
        })(document, 'script')
    }

    render() {
        return null
    }
}

export default ChatwootWidget
