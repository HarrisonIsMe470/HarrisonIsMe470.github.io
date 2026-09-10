---
title: "Latex Document"
description: "Hello, there. I’m writing this post for summarizing Latex syntax that are often used. I don’t like to write reports in Latex as the syntax are so complicated and it’s easy to forget them once you don’t use Latex for a while. Anyway, let’s start to do our summarizing."
pubDate: "2025-10-27"
tags: ["Technology", "Academic Research"]
categories: []
author: "Chino520"
draft: false
slug: "Latex-Document"
legacyHtml: true
legacyPath: "/2025/10/27/Latex-Document/"
excerpt: "<p>Hello, there. I’m writing this post for summarizing Latex syntax that are often used. I don’t like to write reports in Latex as the syntax are so complicated and it’s easy to forget them once you don’t use Latex for a while. Anyway, let’s start to do our summarizing.</p>"
math: true
sourceRepository: "HarrisonIsMe470/HarrisonIsMe470-old-blog"
sourceCommit: "ea1ba1abb8733b2cd81798a77ece90e4b1876e8f"
---

<p>Hello, there. I’m writing this post for summarizing Latex syntax that are often used. I don’t like to write reports in Latex as the syntax are so complicated and it’s easy to forget them once you don’t use Latex for a while. Anyway, let’s start to do our summarizing.</p>
<span id="more"></span>
<ol>
<li>Inserting an image</li>
</ol>
<pre><code class="language-Latex">\begin{figure}[h!]
        \centering % optional
        \includegraphics[width=0.8\textwidth]{image.jpg}
        \caption{cation} % optional
        \label{fig:mypic} % optional
\end{figure}
</code></pre>
<ol start="2">
<li>Inserting a list</li>
</ol>
<pre><code class="language-Latex">\begin{enumerate}
        \item ...
        \item ...
\end{enumerate}
</code></pre>
<ol start="3">
<li>Inserting a table</li>
</ol>
<pre><code class="language-Latex">\begin{tabular}{|c|c|c|}
        \hline
        1 &amp; 2 &amp; 3 \\
        \hline
        4 &amp; 5 &amp; 6 \\
        \hline
\end{tabular}
</code></pre>
<ol start="4">
<li>Emphasizing important words</li>
</ol>
<pre><code class="language-Latex">\textbf{}
</code></pre>
<hr/>
<h1 id="Repair-LaTeX-Error-This-file-needs-format-pLaTeX2e’"><a class="headerlink" href="#Repair-LaTeX-Error-This-file-needs-format-pLaTeX2e’" title="Repair LaTeX Error: This file needs format `pLaTeX2e’"></a>Repair LaTeX Error: This file needs format `pLaTeX2e’</h1><p>This error occurs when you are writing something in Japanese. Here is the solution.</p>
<ol>
<li>Create a file named ‘.latexmkrc’ (without “.tex”)</li>
<li>Insert the following：</li>
</ol>
<pre><code class="language-.latexmkrc"># Compile with upLaTeX + dvipdfmx
$latex = 'uplatex';
$dvipdf = 'dvipdfmx %O -o %D %S';
$bibtex = 'upbibtex %O %S';
$dvipdf = 'dvipdfmx %O -o %D %S';
$makeindex = 'mendex %O -o %D %S';
$pdf_mode = 3;
</code></pre>
<ol start="3">
<li>Open “Menu” on the top-left side, change the compiler to LaTeX</li>
<li>Refresh the project</li>
</ol>
<p>update coming soon…</p>
