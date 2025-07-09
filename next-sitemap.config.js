/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://lazycli.xyz/", // ✅ Replace with your actual domain
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/404", "/500"],
};
