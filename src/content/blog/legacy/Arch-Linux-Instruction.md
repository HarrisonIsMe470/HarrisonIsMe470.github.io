---
title: "Arch Linux Instruction"
description: "A simple Arch Linux instruction"
pubDate: "2025-10-27"
tags: ["Technology"]
categories: []
author: "Chino520"
draft: false
slug: "Arch-Linux-Instruction"
legacyHtml: true
legacyPath: "/2025/10/27/Arch-Linux-Instruction/"
excerpt: "<p>A simple Arch Linux instruction</p>"
math: true
sourceRepository: "HarrisonIsMe470/HarrisonIsMe470-old-blog"
sourceCommit: "ea1ba1abb8733b2cd81798a77ece90e4b1876e8f"
---

<p>A simple Arch Linux instruction</p>
<span id="more"></span>
<div style="text-align: center"><h4>Install a Japanese Input Method on Arch Linux</h4></div>
Install Fcitx5 as the framework and Mozc as the input method

<ol>
<li>Install Packages</li>
</ol>
<pre><code class="language-bash">sudo pacman -S fcitx5 fcitx5-mozc fcitx5-configtool fcitx5-gtk fcitx5-qt
</code></pre>
<ol start="2">
<li>Set Environment Variables<br/>Add these lines to the shell profile file (~/.xprofile for GDM, SDDM, LightDM, ~/.bashrc for bash)</li>
</ol>
<pre><code class="language-Bash">export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
export SDL_IM_MODULE=fcitx
</code></pre>
<p>You can check out your shell by this</p>
<pre><code class="language-Bash">echo $shell
</code></pre>
<ol start="3">
<li>Autostart Fcitx5</li>
</ol>
<pre><code class="language-Bash">fcitx5 -d &amp;
</code></pre>
<ol start="4">
<li><p>Log out &amp; Log in your Arch Linux</p>
</li>
<li><p>Open the configuration tool by running:</p>
</li>
</ol>
<pre><code class="language-Bash">fcitx5-configtool
</code></pre>
<p>In the ‘Input Method’ tab, click the <strong>+</strong> button. Search for and add <strong>Mozc</strong> to your list.</p>
