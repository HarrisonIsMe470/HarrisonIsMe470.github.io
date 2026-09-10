---
title: "Markdown Guide"
description: "A simple Markdown Guide This is a markdown guide that helps you write articles organized and easy to read. Please be aware of that when you’re using Hexo, several syntax may be different from the original Markdown’s syntax. I summarized both of Hexo’s syntax and the original Markdown’s syntax in the mind map, and I have stricken through the original one which I recommend you avoid using. Also, Markdown cannot deal with some needs such as aligning text to the right, even though these needs are quite common. So I’ll use HTML where Markdown doesn’t satisfy my needs. The following content is a practice for these syntax."
pubDate: "2025-10-23"
tags: ["Technology", "Hexo"]
categories: []
author: "Chino520"
draft: false
slug: "Markdown-Guide"
legacyHtml: true
legacyPath: "/2025/10/23/Markdown-Guide/"
excerpt: "<div style=\"text-align: center\"><h1>A simple Markdown Guide</h1></div>\n<!--<img src=\"/2025/10/23/Markdown-Guide/Markdown.jpg\" class=\"\" title=\"Markdown Guide\">-->\n<p>This is a markdown guide that helps you write articles organized and easy to read. <!--This mind map ☝️ shows most syntax that you may need when you intend to explain ideas as clear as possible.--></p>\n<p>Please be aware of that when you’re using Hexo, several syntax may be different from the original Markdown’s syntax. I summarized both of Hexo’s syntax and the original Markdown’s syntax in the mind map, and I have stricken through the original one which I recommend you avoid using. </p>\n<p>Also, Markdown cannot deal with some needs such as aligning text to the right, even though these needs are quite common. So I’ll use HTML where Markdown doesn’t satisfy my needs.</p>\n<p>The following content is a practice for these syntax.</p>"
math: false
sourceRepository: "HarrisonIsMe470/HarrisonIsMe470-old-blog"
sourceCommit: "ea1ba1abb8733b2cd81798a77ece90e4b1876e8f"
---

<div style="text-align: center"><h1>A simple Markdown Guide</h1></div>
<!--<img src="/2025/10/23/Markdown-Guide/Markdown.jpg" class="" title="Markdown Guide">-->
<p>This is a markdown guide that helps you write articles organized and easy to read. <!--This mind map ☝️ shows most syntax that you may need when you intend to explain ideas as clear as possible.--></p>
<p>Please be aware of that when you’re using Hexo, several syntax may be different from the original Markdown’s syntax. I summarized both of Hexo’s syntax and the original Markdown’s syntax in the mind map, and I have stricken through the original one which I recommend you avoid using. </p>
<p>Also, Markdown cannot deal with some needs such as aligning text to the right, even though these needs are quite common. So I’ll use HTML where Markdown doesn’t satisfy my needs.</p>
<p>The following content is a practice for these syntax.</p>
<span id="more"></span>
<hr/>
<h2 id="1-Headings"><a class="headerlink" href="#1-Headings" title="1. Headings"></a>1. Headings</h2><pre><code class="language-Markdown"># Heading level 1
</code></pre>
<blockquote>
<h1 id="Heading-level-1"><a class="headerlink" href="#Heading-level-1" title="Heading level 1"></a>Heading level 1</h1></blockquote>
<pre><code class="language-Markdown">## Heading level 2
</code></pre>
<blockquote>
<h2 id="Heading-level-2"><a class="headerlink" href="#Heading-level-2" title="Heading level 2"></a>Heading level 2</h2></blockquote>
<hr/>
<h2 id="2-Text"><a class="headerlink" href="#2-Text" title="2. Text"></a>2. Text</h2><h3 id="2-1-Alignment"><a class="headerlink" href="#2-1-Alignment" title="2.1 Alignment"></a>2.1 Alignment</h3><pre><code class="language-HTML">&amp;#x3C;div style="text-align: right"&amp;#x3E; Aligning to the right &amp;#x3C;/div&amp;#x3e;
&amp;#x3C;div style="text-align: center"&amp;#x3E; Aligning to the center &amp;#x3C;/div&amp;#x3E;
</code></pre>
<blockquote>
<div style="text-align: right">Aligning to the right</div>
<div style="text-align: center">Aligning to the center</div></blockquote>
<hr/>
<h2 id="3-Emphasis"><a class="headerlink" href="#3-Emphasis" title="3. Emphasis"></a>3. Emphasis</h2><pre><code class="language-Markdown">**Bold Text**
*Italic Text*
***Bold and Italic Text***
~~Strickthough~~
==Important Words==
</code></pre>
<blockquote>
<p><strong>Bold Text</strong><br/><em>Italic Text</em><br/><em><strong>Bold and Italic Text</strong></em><br/><del>Strickthough</del><br/>==Important Words==</p>
</blockquote>
<hr/>
<h2 id="4-Links"><a class="headerlink" href="#4-Links" title="4. Links"></a>4. Links</h2><pre><code class="language-Markdown">My favorite search engine is [Google](https://www.google.com).
</code></pre>
<blockquote>
<p>My favorite search engine is <a href="https://www.google.com/" rel="noopener" target="_blank">Google</a>.</p>
</blockquote>
<pre><code class="language-Markdown">&amp;#x3C;https://chino520.xyz&amp;#x3E;
&amp;#x3C;chino520forever@gmail.com&amp;#x3E;
https://chino520.xyz
`https://chino520.xyz`
</code></pre>
<blockquote>
<p><a href="https://chino520.xyz/" rel="noopener" target="_blank">https://chino520.xyz</a><br/><a href="mailto:chino520forever@gmail.com">chino520forever@gmail.com</a><br/><a href="https://chino520.xyz/" rel="noopener" target="_blank">https://chino520.xyz</a><br/><code>https://chino520.xyz</code></p>
</blockquote>
<hr/>
<h2 id="5-Tables"><a class="headerlink" href="#5-Tables" title="5. Tables"></a>5. Tables</h2><pre><code class="language-Markdown">| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |
</code></pre>
<blockquote>
<table>
<thead>
<tr>
<th align="left">Syntax</th>
<th align="center">Description</th>
<th align="right">Test Text</th>
</tr>
</thead>
<tbody><tr>
<td align="left">Header</td>
<td align="center">Title</td>
<td align="right">Here’s this</td>
</tr>
<tr>
<td align="left">Paragraph</td>
<td align="center">Text</td>
<td align="right">And more</td>
</tr>
</tbody></table>
</blockquote>
<hr/>
<h2 id="6-Lists"><a class="headerlink" href="#6-Lists" title="6. Lists"></a>6. Lists</h2><h3 id="6-1-Ordered-Lists"><a class="headerlink" href="#6-1-Ordered-Lists" title="6.1 Ordered Lists"></a>6.1 Ordered Lists</h3><pre><code class="language-Markdown">1. First item
2. Second item
    1. Indented item
    2. Indented item
3. Third item
</code></pre>
<blockquote>
<ol>
<li>First item</li>
<li>Second item<ol>
<li>Indented item</li>
<li>Indented item</li>
</ol>
</li>
<li>Third item</li>
</ol>
</blockquote>
<h3 id="6-2-Unordered-Lists"><a class="headerlink" href="#6-2-Unordered-Lists" title="6.2 Unordered Lists"></a>6.2 Unordered Lists</h3><pre><code class="language-Markdown">- First item
- Second item
    - Indented item
    - Indented item
- Third item'
</code></pre>
<blockquote>
<ul>
<li>First item</li>
<li>Second item<ul>
<li>Indented item</li>
<li>Indented item</li>
</ul>
</li>
<li>Third item</li>
</ul>
</blockquote>
<h3 id="6-3-Task-Lists"><a class="headerlink" href="#6-3-Task-Lists" title="6.3 Task Lists"></a>6.3 Task Lists</h3><pre><code class="language-Markdown">- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
</code></pre>
<blockquote>
<ul>
<li><input checked="" disabled="" type="checkbox"/> Write the press release</li>
<li><input disabled="" type="checkbox"/> Update the website</li>
<li><input disabled="" type="checkbox"/> Contact the media</li>
</ul>
</blockquote>
<hr/>
<h2 id="7-Images"><a class="headerlink" href="#7-Images" title="7. Images"></a>7. Images</h2><pre><code class="language-Markdown">{% asset_img "Resource Path" "Description" %}
</code></pre>
<blockquote>
<img class="" src="/2025/10/23/Markdown-Guide/Markdown.jpg" title="Markdown Guide"/></blockquote>
<hr/>
<h2 id="8-Code-Blocks"><a class="headerlink" href="#8-Code-Blocks" title="8. Code Blocks"></a>8. Code Blocks</h2><pre><code class="language-Markdown">&amp;#96;&amp;#96;&amp;#96;Python
Print("Hello World!")
&amp;#96;&amp;#96;&amp;#96;
</code></pre>
<blockquote>
<pre><code class="language-Python">Print("Hello World!")
</code></pre>
</blockquote>
<pre><code class="language-Markdown">At the command prompt, type &amp;#96;nano&amp;#96;.
</code></pre>
<blockquote>
<p>At the command prompt, type <code>nano</code>.</p>
</blockquote>
<hr/>
<h2 id="9-Blockquotes"><a class="headerlink" href="#9-Blockquotes" title="9. Blockquotes"></a>9. Blockquotes</h2><pre><code class="language-Markdown">&amp;#x3E; Stronger (What Doesn't Kill You)
&amp;#x3E; Kelly Clarkson
&amp;#x3E; what doesn't kill you makes you stronger
</code></pre>
<blockquote>
<blockquote>
<p>Stronger (What Doesn’t Kill You)<br/>Kelly Clarkson<br/>what doesn’t kill you makes you stronger</p>
</blockquote>
</blockquote>
<hr/>
<h2 id="10-Horizontal-Rules"><a class="headerlink" href="#10-Horizontal-Rules" title="10. Horizontal Rules"></a>10. Horizontal Rules</h2><pre><code class="language-Markdown">---
***
___
</code></pre>
<p>Three of them have the same line style 👇 (Yes! Undoubtedly this separate line!)</p>
<hr/>
<p>Update coming soon…</p>
