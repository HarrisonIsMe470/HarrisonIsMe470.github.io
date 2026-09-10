---
title: "Mistakes Summary"
description: "I’m writing this post to summarize all the mistakes I’ve been making for several times. You know what? They just don’t come into my mind!"
pubDate: "2025-10-27"
tags: ["Chino520"]
categories: []
author: "Chino520"
draft: false
slug: "Mistakes-Summary"
legacyHtml: true
legacyPath: "/2025/10/27/Mistakes-Summary/"
excerpt: "<p>I’m writing this post to summarize all the mistakes I’ve been making for several times. You know what? They just don’t come into my mind!</p>"
math: false
sourceRepository: "HarrisonIsMe470/HarrisonIsMe470-old-blog"
sourceCommit: "ea1ba1abb8733b2cd81798a77ece90e4b1876e8f"
---

<p>I’m writing this post to summarize all the mistakes I’ve been making for several times. You know what? They just don’t come into my mind!</p>
<span id="more"></span>
<h4 id="1-Don’t-create-mutable-objects-by"><a class="headerlink" href="#1-Don’t-create-mutable-objects-by" title="1. Don’t create mutable objects by *"></a>1. Don’t create mutable objects by *</h4><blockquote>
<p>❌</p>
<pre><code class="language-Python">sums = [[0] * number_of_experiments] * number_of_participants
</code></pre>
</blockquote>
<blockquote>
<p>⭕</p>
<pre><code class="language-Python">sums = [[0] * number_of_experiments for _ in range(number_of_participants)]
</code></pre>
</blockquote>
<p>When multiply inner lists by *, only the reference of that single inner list will be copied multiple times instead of creating new lists.</p>
