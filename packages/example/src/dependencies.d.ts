declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.css" {}

declare module "react-graph-vis" {
  export default any;
}
