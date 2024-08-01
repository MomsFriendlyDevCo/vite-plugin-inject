Vite-Plugin-Inject
==================
Inject files into Vite output.

This plugin takes a list of file definition and simply writes them into the `/dist` directory (or wherever Vite is configured to output).


```javascript
# vite.config.js
import pluginInject from 'vite-plugin-inject';

export default {
    plugins: [
        pluginInject([

            { // An example humans.txt file injected into /dist/humans.txt
                name: 'humans.txt',
                content() { return [
                    '/' + '* TEAM *' + '/',
                    'Developer: Matt Carter',
                    'Contact: contact@acme.com',
                    'Location: Gold Coast, Australia',
                    '',
                    '',
                    '/' + '* SITE *' + '/',
                    `Last update: ${(new Date()).toISOString().substr(0, 10).replace(/-/g, '\/')}`,
                    'Doctype: HTML5',
                    'Standards: HTML5, CSS3, JavaScript ES2024',
                    'Components: Vue',
                ]},
            },

            {
                name: 'robots.txt',
                content() { return [
                    'User-agent: *',
                    'Allow: /',
                    'Disallow: /login',
                    'Disallow: /profile',
                    '',
                    'Sitemap: https://acme.com/sitemap.xml',
                ]},
            },

            {
                name: 'sitemap.xml',
                async content() {
                    let {default: routes} = await import('./routes.js');

                    return [
                        '<?xml version="1.0" encoding="UTF-8"?>',
                        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                        ...(tools
                            .flatMap(route => [
                                '\t<url>',
                                `\t\t<loc>https://acme.com${route.path}</loc>`,
                                '\t\t<changefreq>monthly</changefreq>',
                                '\t</url>',
                            ])
                        ),
                        '</urlset>',
                    ];
                },
            },
        ]),
    ],
}
```


API
===
This plugin exposes a single function which takes an array of files to output.

Each file should be an object composed of a `name` string and an Async `content` function which returns the content. The content will be collapsed into a line-delimited string if an array is returned.

File object definitions:

| Property  | Type       | Default        | Description                                                                      |
|-----------|------------|----------------|----------------------------------------------------------------------------------|
| `name`    | `String`   |                | The file name, nested files can be noted with slashes                            |
| `content` | `Function` |                | A function which can return the string content to output or an array of the same |
| `mime`    | `String`   | `'text/plain'` | The mime type to serve (when in dev mode)                                        |
