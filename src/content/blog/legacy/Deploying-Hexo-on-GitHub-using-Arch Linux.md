---
title: "Deploying Hexo on GitHub using Arch Linux"
description: "A simple guide that helps you deploy Hexo on your GitHub pages using Arch Linux"
pubDate: "2025-10-21"
tags: ["Technology", "Hexo"]
categories: []
author: "Chino520"
draft: false
slug: "Deploying-Hexo-on-GitHub-using-Arch Linux"
legacyHtml: true
legacyPath: "/2025/10/21/Deploying-Hexo-on-GitHub-using-Arch Linux/"
excerpt: "<p>A simple guide that helps you deploy Hexo on your GitHub pages using Arch Linux</p>"
math: true
sourceRepository: "HarrisonIsMe470/HarrisonIsMe470-old-blog"
sourceCommit: "ea1ba1abb8733b2cd81798a77ece90e4b1876e8f"
---

<p>A simple guide that helps you deploy Hexo on your GitHub pages using Arch Linux</p>
<span id="more"></span>
<h1 id="1-Before-Hexo’s-installation"><a class="headerlink" href="#1-Before-Hexo’s-installation" title="1. Before Hexo’s installation"></a>1. Before Hexo’s installation</h1><ol>
<li>Create a GitHub repository where stores your data</li>
<li>Prepare for Git<ol>
<li>Download by <code>sudo pacman -S git</code></li>
<li>Set authority information. Set your user email by <code>git config --global  user.email "Your email"</code>, and set your user name by <code>git config --global  user.name "Your name"</code></li>
<li>Generate a SSH key by <code>ssh-keygen -t ed25519 -C "your_github_email@example.com"</code>. Your private key would be <code>id_edXXXXX</code>. KEEP IT IN SECRET! Your public key would be <code>id_edXXXXX.pub</code>.</li>
<li>Copy and paste the SSH key into Github <code>cat ~/.ssh/id_edXXXXX.pub</code></li>
</ol>
</li>
<li>Prepare for OpenSSH<ol>
<li>Start the SSH Agent by <code>eval "$(ssh-agent -s)"</code></li>
<li>Add your private key by <code>ssh-add ~/.ssh/id_edXXXXX</code></li>
<li>Test your connection by <code>ssh -T your_github_email@example.com</code></li>
</ol>
</li>
</ol>
<h1 id="2-Hexo’s-installation"><a class="headerlink" href="#2-Hexo’s-installation" title="2. Hexo’s installation"></a>2. Hexo’s installation</h1><ol>
<li>Install Node.js by <code>sudo pacman -S nodejs</code></li>
<li>Install npm(Node Package Manager) by <code>sudo pacman -S npm</code></li>
<li>Install Hexo by <code>sudo npm install -g hexo-cli</code></li>
<li>Initialize Hexo by <code>hexo init</code></li>
<li>Generate the public directory by <code>hexo generate</code></li>
<li>Install the deployment add-on by <code>sudo npm install hexo-deployer-git --save</code></li>
<li>Edit the _config.yml file as following:</li>
</ol>
<pre><code class="language-_config.yml">  deploy: 
    type: git 
    repo: git@github.com:your_user_name/your_repo_name.git # Use SSH
    branch: main 
</code></pre>
<ol start="8">
<li>Deploy Hexo by <code>hexo deploy</code></li>
</ol>
<h1 id="3-Hexo’s-Commands"><a class="headerlink" href="#3-Hexo’s-Commands" title="3. Hexo’s Commands"></a>3. Hexo’s Commands</h1><p><code>hexo generate</code><br/><code>hexo deploy</code><br/>Clear the cache: <code>hexo cl</code><br/>When you finished editing posts, run <code>hexo cl &amp;&amp; hexo g &amp;&amp; hexo d</code> at once<br/><code>hexo new "[Post Name]"</code><br/>Add a new menu: run <code>hexo new page "tags"</code>, and add “tags” into post’s front matter</p>
<h1 id="4-Customize-Your-Themes"><a class="headerlink" href="#4-Customize-Your-Themes" title="4. Customize Your Themes"></a>4. Customize Your Themes</h1><p>You can find themes on <a href="https://hexo.io/themes/" rel="noopener" target="_blank">https://hexo.io/themes/</a> or Github. I’m using Particlex theme. Here’s its installation process:</p>
<ol>
<li>Go to the themes directory by <code>cd themes</code></li>
<li>Clone its git repo by <code>git clone https://github.com/theme-particlex/hexo-theme-particlex.git particlex --depth=1</code></li>
<li>Set up your theme to Particlex by editing Hexo’s _config.yml which is under /</li>
</ol>
<pre><code class="language-_config_yml">theme: particlex
</code></pre>
<p>I also added a comment system and a heart click effect.</p>
<h2 id="4-1-Waline-A-Comment-System"><a class="headerlink" href="#4-1-Waline-A-Comment-System" title="4.1 Waline - A Comment System"></a>4.1 Waline - A Comment System</h2><p>To deploy Waline, you need the following things: LeanCloud, SupaBase, Vercel</p>
<h3 id="LeanCloud"><a class="headerlink" href="#LeanCloud" title="LeanCloud"></a>LeanCloud</h3><ol>
<li>Register an account and create an application</li>
<li>Go to settings -&gt; App Keys and keep these three keys: AppID, AppKey and MasterKey</li>
</ol>
<h3 id="SupaBase"><a class="headerlink" href="#SupaBase" title="SupaBase"></a>SupaBase</h3><ol>
<li>Sign in using your GitHub account</li>
<li>Create a project. Don’t forget your password</li>
<li>Copy the official template table to SQL Editor and run it</li>
<li>Press connect button and go to View Parameters</li>
<li>Keep all parameters</li>
</ol>
<h3 id="Vercel"><a class="headerlink" href="#Vercel" title="Vercel"></a>Vercel</h3><ol>
<li>Sign in using your GitHub account and add your GitHub account to Git Scope</li>
<li>Press the Create. Vercel will create a new reposotiry</li>
<li>Press the Continue to Dashboard. Go to Setting -&gt; Environment Variables</li>
<li>Add three new variables that copied from LeanCloud: LEAN_ID, LEAN_KEY and LEAN_MASTER_KEY</li>
<li>Add these new variables that copied from SupaBase: PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD, PG_PREFIX(wl_), PG_SSL(empty)</li>
<li>Redeploy the project</li>
<li>Keep the serverURL (<a href="https://xxx.vercel.app/" rel="noopener" target="_blank">https://XXX.vercel.app/</a>). You would go into your backend through “visit” button, and find the serverURL on the browser’s URL bar.</li>
<li>Modify particlex’s setting files</li>
</ol>
<pre><code class="language-_config.yml">/themes/particlex/_config.yml
waline:
  serverURL: https://XXX.vercel.app/
</code></pre>
<h2 id="4-2-Add-a-click-heart-effect"><a class="headerlink" href="#4-2-Add-a-click-heart-effect" title="4.2 Add a click heart effect"></a>4.2 Add a click heart effect</h2><ol>
<li>Write animation code and store it in <code>themes/particlex/source/js/XXX.js</code></li>
<li>Append the following code at the end of <code>themes/particlex/layout/footer.ejs</code></li>
</ol>
<pre><code class="language-ejs">&amp;#x3C;script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"&amp;#x3E;&amp;#x3C;/script&amp;#x3E;
&amp;#x3C;script src="&amp;#x3C;%- url_for('/js/heart.js') %&amp;#x3E;"&amp;#x3E;&amp;#x3C;/script&amp;#x3E;
</code></pre>
<h1 id="5-Customized-Domain"><a class="headerlink" href="#5-Customized-Domain" title="5. Customized Domain"></a>5. Customized Domain</h1><p>If you are tend to have your own domain, you would have to buy one (I bought this domain by myself from Spaceship——a DNS service provier). After purchasing a domain, you would have to</p>
<ol>
<li>Go to your GitHub settings page -&gt; Pages -&gt; Add a domain -&gt; keep the TXT record and code</li>
<li>Edit Custom DNS Records on your DNS service provier setting pages<ol>
<li>Set four A records for mapping the root domain to GitHub’s server</li>
<li>Set a CNAME record for mapping to the specific location which is your repository domain</li>
<li>Set a TXT record for </li>
<li>Waiting for DNS propagation</li>
</ol>
</li>
<li>Go to your repository settings page -&gt; Pages -&gt; Custom domain. Enter your domain and wait for its certification</li>
</ol>
<h1 id="5-Extensions"><a class="headerlink" href="#5-Extensions" title="5. Extensions"></a>5. Extensions</h1><h2 id="5-1-Katex"><a class="headerlink" href="#5-1-Katex" title="5.1 Katex"></a>5.1 Katex</h2><p>Katex is </p>
<ol>
<li>sudo npm install katex</li>
</ol>
<!--# 5.1 Music Player 
Implement it by an injector
1. Make a directory 'scripts' under /
2. Create a .js file 'music-player-injector.js'
3. Write injection code into 'music-player-injector.js'. I wrote it by ChatGPT
4. Store music under /source/music directory
5. Store the covers of music under /source/images directory
6. Add music information into music-player-injector.js as following:
```JavaScript
{
  name: 'name',
  artist: 'artist',
  url: '/music/music.mp3', 
  cover: '/images/cover.webp' 
}
```
   
For more details please refer to the official API
> https://hexo.io/api/injector

and Aplayer's API
> https://aplayer.js.org/-->
<!-- -->
