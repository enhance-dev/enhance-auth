import { getStyles } from '@enhance/arc-plugin-styles'

export default function Head() {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>My Enhance Project</title>
      ${getStyles.linkTag()}
      <link rel="icon" href="/_public/favicon.svg">
    </head>
  `
}
