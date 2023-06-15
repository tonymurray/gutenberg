"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[7843],{"./packages/components/src/truncate/component.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _ui_context__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/components/src/ui/context/context-connect.ts"),_view__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/src/view/component.tsx"),_hook__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/src/truncate/hook.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");function UnconnectedTruncate(props,forwardedRef){const truncateProps=(0,_hook__WEBPACK_IMPORTED_MODULE_1__.Z)(props);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_view__WEBPACK_IMPORTED_MODULE_2__.Z,{as:"span",...truncateProps,ref:forwardedRef})}UnconnectedTruncate.displayName="UnconnectedTruncate";const Truncate=(0,_ui_context__WEBPACK_IMPORTED_MODULE_3__.Iq)(UnconnectedTruncate,"Truncate"),__WEBPACK_DEFAULT_EXPORT__=Truncate;try{Truncate.displayName="Truncate",Truncate.__docgenInfo={description:"`Truncate` is a typography primitive that trims text content.\nFor almost all cases, it is recommended that `Text`, `Heading`, or\n`Subheading` is used to render text content. However,`Truncate` is\navailable for custom implementations.\n\n```jsx\nimport { __experimentalTruncate as Truncate } from `@wordpress/components`;\n\nfunction Example() {\n\treturn (\n\t\t<Truncate>\n\t\t\tLorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ex\n\t\t\tneque, vulputate a diam et, luctus convallis lacus. Vestibulum ac\n\t\t\tmollis mi. Morbi id elementum massa.\n\t\t</Truncate>\n\t);\n}\n```",displayName:"Truncate",props:{ellipsis:{defaultValue:{value:"'…'"},description:"The ellipsis string when truncating the text by the `limit` prop's value.",name:"ellipsis",required:!1,type:{name:"string"}},ellipsizeMode:{defaultValue:{value:"'auto'"},description:"Determines where to truncate.  For example, we can truncate text right in\nthe middle. To do this, we need to set `ellipsizeMode` to `middle` and a\ntext `limit`.\n\n* `auto`: Trims content at the end automatically without a `limit`.\n* `head`: Trims content at the beginning. Requires a `limit`.\n* `middle`: Trims content in the middle. Requires a `limit`.\n* `tail`: Trims content at the end. Requires a `limit`.",name:"ellipsizeMode",required:!1,type:{name:"enum",value:[{value:'"head"'},{value:'"none"'},{value:'"auto"'},{value:'"middle"'},{value:'"tail"'}]}},limit:{defaultValue:{value:"0"},description:"Determines the max number of characters to be displayed before the rest\nof the text gets truncated. Requires `ellipsizeMode` to assume values\ndifferent from `auto` and `none`.",name:"limit",required:!1,type:{name:"number"}},numberOfLines:{defaultValue:{value:"0"},description:"Clamps the text content to the specified `numberOfLines`, adding an\nellipsis at the end. Note: this feature ignores the value of the\n`ellipsis` prop and always displays the default `…` ellipsis.",name:"numberOfLines",required:!1,type:{name:"number"}},children:{defaultValue:null,description:"The children elements.",name:"children",required:!0,type:{name:"ReactNode"}},as:{defaultValue:null,description:"The HTML element or React component to render the component as.",name:"as",required:!1,type:{name:'"symbol" | "object" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "button" | "canvas" | ... 507 more ... | ("view" & FunctionComponent<...>)'}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/truncate/component.tsx#Truncate"]={docgenInfo:Truncate.__docgenInfo,name:"Truncate",path:"packages/components/src/truncate/component.tsx#Truncate"})}catch(__react_docgen_typescript_loader_error){}},"./packages/components/src/truncate/hook.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useTruncate});var emotion_react_browser_esm=__webpack_require__("./node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),react=__webpack_require__("./node_modules/react/index.js"),use_context_system=__webpack_require__("./packages/components/src/ui/context/use-context-system.js");const Truncate={name:"hdknak",styles:"display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"};var values=__webpack_require__("./packages/components/src/utils/values.js");const TRUNCATE_ELLIPSIS="…",TRUNCATE_TYPE={auto:"auto",head:"head",middle:"middle",tail:"tail",none:"none"},TRUNCATE_DEFAULT_PROPS={ellipsis:TRUNCATE_ELLIPSIS,ellipsizeMode:TRUNCATE_TYPE.auto,limit:0,numberOfLines:0};function truncateContent(words="",props){const mergedProps={...TRUNCATE_DEFAULT_PROPS,...props},{ellipsis,ellipsizeMode,limit}=mergedProps;if(ellipsizeMode===TRUNCATE_TYPE.none)return words;let truncateHead,truncateTail;switch(ellipsizeMode){case TRUNCATE_TYPE.head:truncateHead=0,truncateTail=limit;break;case TRUNCATE_TYPE.middle:truncateHead=Math.floor(limit/2),truncateTail=Math.floor(limit/2);break;default:truncateHead=limit,truncateTail=0}const truncatedContent=ellipsizeMode!==TRUNCATE_TYPE.auto?function truncateMiddle(word,headLength,tailLength,ellipsis){if("string"!=typeof word)return"";const wordLength=word.length,frontLength=~~headLength,backLength=~~tailLength,truncateStr=(0,values.Jf)(ellipsis)?ellipsis:TRUNCATE_ELLIPSIS;return 0===frontLength&&0===backLength||frontLength>=wordLength||backLength>=wordLength||frontLength+backLength>=wordLength?word:0===backLength?word.slice(0,frontLength)+truncateStr:word.slice(0,frontLength)+truncateStr+word.slice(wordLength-backLength)}(words,truncateHead,truncateTail,ellipsis):words;return truncatedContent}var use_cx=__webpack_require__("./packages/components/src/utils/hooks/use-cx.ts");function useTruncate(props){const{className,children,ellipsis=TRUNCATE_ELLIPSIS,ellipsizeMode=TRUNCATE_TYPE.auto,limit=0,numberOfLines=0,...otherProps}=(0,use_context_system.y)(props,"Truncate"),cx=(0,use_cx.I)(),truncatedContent=truncateContent("string"==typeof children?children:"",{ellipsis,ellipsizeMode,limit,numberOfLines}),shouldTruncate=ellipsizeMode===TRUNCATE_TYPE.auto;return{...otherProps,className:(0,react.useMemo)((()=>cx(shouldTruncate&&!numberOfLines&&Truncate,shouldTruncate&&!!numberOfLines&&(0,emotion_react_browser_esm.iv)("-webkit-box-orient:vertical;-webkit-line-clamp:",numberOfLines,";display:-webkit-box;overflow:hidden;",""),className)),[className,cx,numberOfLines,shouldTruncate]),children:truncatedContent}}},"./packages/components/src/truncate/stories/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__,Default:()=>Default,CharacterCount:()=>CharacterCount});var ___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/src/truncate/component.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={component:___WEBPACK_IMPORTED_MODULE_1__.Z,title:"Components (Experimental)/Truncate",argTypes:{children:{control:{type:"text"}},as:{control:{type:"text"}}},parameters:{sourceLink:"packages/components/src/truncate",controls:{expanded:!0},docs:{source:{state:"open"}}}},defaultText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut facilisis dictum tortor, eu tincidunt justo scelerisque tincidunt. Duis semper dui id augue malesuada, ut feugiat nisi aliquam. Vestibulum venenatis diam sem, finibus dictum massa semper in. Nulla facilisi. Nunc vulputate faucibus diam, in lobortis arcu ornare vel. In dignissim nunc sed facilisis finibus. Etiam imperdiet mattis arcu, sed rutrum sapien blandit gravida. Aenean sollicitudin neque eget enim blandit, sit amet rutrum leo vehicula. Nunc malesuada ultricies eros ut faucibus. Aliquam erat volutpat. Nulla nec feugiat risus. Vivamus iaculis dui aliquet ante ultricies feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus nec pretium velit, sit amet consectetur ante. Praesent porttitor ex eget fermentum mattis.",Template=args=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(___WEBPACK_IMPORTED_MODULE_1__.Z,{...args});Template.displayName="Template";const Default=Template.bind({});Default.args={numberOfLines:2,children:defaultText};const CharacterCount=Template.bind({});CharacterCount.args={limit:23,children:defaultText,ellipsizeMode:"tail",ellipsis:"[---]"},CharacterCount.storyName="Truncate by character count";try{ComponentMeta.displayName="ComponentMeta",ComponentMeta.__docgenInfo={description:"For the common case where a component's stories are simple components that receives args as props:\n\n```tsx\nexport default { ... } as ComponentMeta<typeof Button>;\n```",displayName:"ComponentMeta",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/truncate/stories/index.tsx#ComponentMeta"]={docgenInfo:ComponentMeta.__docgenInfo,name:"ComponentMeta",path:"packages/components/src/truncate/stories/index.tsx#ComponentMeta"})}catch(__react_docgen_typescript_loader_error){}}}]);