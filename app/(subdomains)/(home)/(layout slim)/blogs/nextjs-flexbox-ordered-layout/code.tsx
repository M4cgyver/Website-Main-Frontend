export const exampleCode1 = `<html lang="en">
<head>
    <title>Groceries List Example</title>
    <style>
        body { 
            color: white;                       /* Set default text color to white */
            background-color: black;            /* Set the webpage background to black */
        } 

        .ordered-list {
            display: flex;                      /* Set the display to flex */
            flex-direction: column;             /* Set the flex display to column; positioned the elements vertically in a column, allowing content to flow from top to bottom. */
        }

        .ordered-list div {
            font-family: Arial, sans-serif;     /* Set the font family */
            font-size: 18px;                    /* Set the font size */
            color: blanchedalmond;              /* Set the color of the text */
            margin-bottom: 10px;                /* Adds space between items */
        }
    </style>
</head>
<body>
    <h1>Top 5 Cities to Visit</h1>
    <div class="ordered-list">
        <div style="order: 3;">Bread</div>
        <div style="order: 1;">Eggs</div>
        <div style="order: 5;">Coffee</div>
        <div style="order: 2;">Cereal</div>
        <div style="order: 4;">Potatoes</div>
    </div>
</body>
</html>`;

export const exampleCode2 = {
    'page.tsx': 'import stylesLayout from "./layout.module.css";\n\nexport default function BlogsNextjs13OrderedLayoutsExample2Index() {\n    return (\n        <>\n            {/*The title element for the page*/}\n            <div className={stylesLayout.title}>\n                Title: Index page!\n            </div>\n            {/*The content for the page*/}\n            <div className={stylesLayout.content}>\n                This is the index page, Hello World!\n            </div>\n        </>\n    );\n}',

    'page.module.css': '.main {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    align-items: center;\n    padding: 6rem;\n    min-height: 100vh;\n  }\n\n  .description {\n    display: inherit;\n    justify-content: inherit;\n    align-items: inherit;\n    font-size: 0.85rem;\n    max-width: var(--max-width);\n    width: 100%;\n    z-index: 2;\n    font-family: var(--font-mono);\n  }\n\n  /* Remaining CSS rules... */',

    'layout.tsx': 'import "./globals.css";\nimport styles from "./layout.module.css";\nimport Link from "next/link";\n\nconst baseUrl = "http://localhost:3000/etc/nextjs-flexbox-ordered-layout-example";\n\nexport default async function RootLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html lang="en">\n      <body>\n          <div className={styles.navigation}>\n            <Link href={`${baseUrl}/`}>Index</Link>\n            <Link href={`${baseUrl}/about`}>About</Link>\n            <Link href={`${baseUrl}/contact`}>Contact</Link>\n          </div>\n\n          <div className={styles.footer}>\n            This is a footer! Super secret text down here!\n          </div>\n\n          {children}\n      </body>\n    </html>\n  );\n}',

    'layout.module.css': '.title {\n    order: 1;\n    font-weight: bold;\n    background-color: rgba(40, 156, 17, 0.452);\n    padding: 4px;\n    margin-bottom: 6px;\n    text-align: center;\n}\n\n.navigation {\n    order: 2;\n    display: flex;\n    justify-content: space-evenly;\n    background-color: rgba(156, 108, 17, 0.452);\n    margin-bottom: 12px;\n}\n\n/* Remaining CSS rules... */',

    'about/page.tsx': 'import stylesLayout from "../layout.module.css";\n\nexport default function BlogsNextjs13OrderedLayoutsExample2Contact() {\n    return (\n        <>\n            <div className={stylesLayout.title}>\n                About this site\n            </div>\n            <div className={stylesLayout.content}>\n                This is an example site for flexbox and order in NextJS 13.\n            </div>\n        </>\n    );\n}',

    'contact/page.tsx': 'import stylesLayout from "../layout.module.css";\n\nexport default function BlogsNextjs13OrderedLayoutsExample2Index() {\n    return (\n        <>\n            <div className={stylesLayout.title}>\n                Title: Index page!\n            </div>\n            <div className={stylesLayout.content}>\n                This is the index page, Hello World!\n            </div>\n        </>\n    );\n}',
};
