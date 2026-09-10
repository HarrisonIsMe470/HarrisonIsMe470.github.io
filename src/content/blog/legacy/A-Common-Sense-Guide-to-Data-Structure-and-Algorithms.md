---
title: "A Common-Sense Guide to Data Structure and Algorithms"
description: "Remember, It is important to associate new knowledge with those you’ve already learnt."
pubDate: "2025-10-26"
tags: ["Technology", "Book Summary"]
categories: []
author: "Chino520"
draft: false
slug: "A-Common-Sense-Guide-to-Data-Structure-and-Algorithms"
legacyHtml: true
legacyPath: "/2025/10/26/A-Common-Sense-Guide-to-Data-Structure-and-Algorithms/"
excerpt: "<p>Remember, It is important to associate new knowledge with those you’ve already learnt.</p>"
math: true
sourceRepository: "HarrisonIsMe470/HarrisonIsMe470-old-blog"
sourceCommit: "ea1ba1abb8733b2cd81798a77ece90e4b1876e8f"
---

<p>Remember, It is important to associate new knowledge with those you’ve already learnt.</p>
<span id="more"></span>
<hr/>
<h1 id="Chapter-9-Stacks-and-Queues"><a class="headerlink" href="#Chapter-9-Stacks-and-Queues" title="Chapter 9. Stacks and Queues"></a>Chapter 9. Stacks and Queues</h1><p>Stacks and queues are used to handle temporary data.</p>
<div style="text-align: center"><h3>Stacks</h3></div>
<p>Stacks follow the rule of LIFO, which stands for “Last In, First Out”. This means the item pushed onto a stack is always the first item poped from it. While a stack is not a built-in data structure in most programming languages, it’s still an abstract data type revolves around some other built-in data structure. A programming language linter is an example of the implementation using stacks, and the ‘undo’ function in a word processor is also a great use case for a stack.</p>
<div style="text-align: center"><h3>Queues</h3></div>
<p>Queues follow the rule of FIFO, which stands for “First In, First Out”.</p>
<h2 id="Exercise"><a class="headerlink" href="#Exercise" title="Exercise"></a>Exercise</h2><p>Write a function that uses a stack to reserve a string.<br/>The stack class is given as follows:</p>
<pre><code class="language-Ruby"># It is "class", not "Class"
class Stack
    def initialize
        # @ marks data as an instance variable, which means that every data is unique inside every instance
        @data = [] 
    end

    def push(element)
        @data &lt;&lt; element
    end

    def pop
        # removes and returns the last element
        @data.pop
    end

    def read
        # only returns the last element
        @data.last
    end
end
</code></pre>
<p>Solution:</p>
<pre><code class="language-Ruby">require_relative 'stack.rb'
def reverse_strings(string)
    reversed_string = ""
    # instance name = (class name).new
    stack = Stack.new

    # Turn strings into char's array by string.chars
    # (iterable object).each do |element|
    string.chars.each do |char| # Or string.each_char do |char|
        stack.push(char)
    end
    
    # stack.read likely evaluates to true as long as there is an element to read
    while stack.read
        reversed_string &lt;&lt; stack.pop
    end
    
    return reversed_string
end

reversed_string = reverse_strings("abcdefg")
puts reversed_string
</code></pre>
<hr/>
<h1 id="Chapter-10-Recursion"><a class="headerlink" href="#Chapter-10-Recursion" title="Chapter 10. Recursion"></a>Chapter 10. Recursion</h1><div style="text-align: center"><h3>Base Case</h3></div>
<p>Recursion needs a <strong>base case</strong> to prevent from infinitely recalling itself. In the following case:</p>
<pre><code class="language-JavaScript">function countdown(number)
    console.log(number)
    if(number === 0) {
        return;
    } else{
        countdown(number - 1);
    }
}
</code></pre>
<p>0 is the <strong>base case</strong> for the countdown() function.<br/><strong>Stack overflow</strong> might be caused when the recursive functions are recalled again and again until the computer doesn’t have enough memory to hold all the data.</p>
<h4 id="Exercise-1"><a class="headerlink" href="#Exercise-1" title="Exercise"></a>Exercise</h4><p>Write a recursive function that prints all the numbers contained in this array.</p>
<pre><code class="language-Ruby">array = [   1,
            2,
            3,
            [4, 5, 6],
            7, 
            [8,
                [9, 10, 11,
                    [12, 13, 14]
                ]
            ],
            [15, 16, 17, 18, 19,
                [20, 21, 22,
                    [23, 24, 25,
                        [26, 27, 29]
                    ], 30, 31
                ], 32
            ], 33
        ]
</code></pre>
<p>Solution:</p>
<pre><code class="language-Ruby"># the base case would be the last element in the array
def print_numbers(array)
    array.each do |element|
        # .kind_of?(specific kind of data)
        # As a kind of data, start with a big letter: 'Array' instead of 'array'.
        if element.kind_of?(Array)
            print_numbers(element)
        else
            puts element
        end
    end
end

print_numbers(array)
</code></pre>
<hr/>
<h1 id="Chapter-11-How-to-Write-Recursive-Functions"><a class="headerlink" href="#Chapter-11-How-to-Write-Recursive-Functions" title="Chapter 11. How to Write Recursive Functions"></a>Chapter 11. How to Write Recursive Functions</h1><div style="text-align: center"><h3>Identifying the subproblem</h3></div>
<p>when writing recursive functions, it is important to identify the subproblem of the problem. Now, we have to write a function that sums up all the numbers in a given array. If we pass an array, <code>[1, 2, 3, 4, 5]</code> into the function, then the subproblem will be getting the sum of <code>[2, 3, 4, 5]</code>, since <code>[1, 2, 3, 4, 5] = 1 + [2, 3, 4, 5]</code>.</p>
<!--<div style="text-align: center"><H3>Passing Extra Parameters</H3></div>

The issue is that we want to double every element stored in an array in place, and we tried to implement it as follows:
```python
def double_array(array):
    array[0] *= 2
    double_array(array)
```

Then we've got stacked here, since we don't know how to proceed to double the number at index 1. One way to solve this problem is passing the index through an extra parameter.
```python
def double_array(array, index):
    if index >= len(array):
        return # The base case
    array[index] *= 2
    double_array(array, index + 1)
```

Admittedly, if we always want to start out index off at 0, we can achieve it by setting a default parameter argument: 
```python
def double_array(array, index=0):
    if index >= len(array):
        return # The base case
    array[index] *= 2
    double_array(array, index + 1)
```-->
<div style="text-align: center"><h3>Bottom-up Approach</h3></div>
<p>Factorial refers to calculate the production of consecutive positive numbers starting from 1 to n. The following code is an implementation example to proceed the factorial(n).</p>
<pre><code class="language-Ruby">def factorial(n, i=1, product=1)
    return product if i &gt; n
    return factorial(n, i + 1, product * i)
end
</code></pre>
<p>When going bottom up, we’re employing the same strategy for making the calculation as same as we’re using a loop:</p>
<pre><code class="language-Ruby">def factorial(n)
    product = 1
    (1...n).each do |num|
        product *= num
    end
    return product
end
</code></pre>
<div style="text-align: center"><h3>Top-down Approach</h3></div>
<p>The code that solves the factorial problem by using top-down approach would be like this:</p>
<pre><code class="language-Ruby">def factorial(n)
    return 1 if n == 1
    return n * factorial(n-1)
end
</code></pre>
<p>Technically, we assume that the function will return the correct value without necessarily understanding how the internal factorial functions work. Writing recursive function using a top-down approach can be achieved through three processes:</p>
<ol>
<li>Imagine that someone else has alreay implemented the function you’re writing. You only need the return value of that function.</li>
<li>Identify the subproblem of the problem.</li>
<li>Add the base case.<br/>This approach benefits us with ignoring the nitty-gitty details of how the algorithms actually works and free our mind.</li>
</ol>
<h3 id="Exercise-2"><a class="headerlink" href="#Exercise-2" title="Exercise"></a>Exercise</h3><h4 id="Exercise-1"><a class="headerlink" href="#Exercise-1" title="Exercise 1"></a>Exercise 1</h4><p>Use recursion to write a function that accepts an array of strings and returns the total numbers of characters across all the strings.<br/>My solution:</p>
<pre><code class="language-Ruby">def char_counter(array)
    # subproblem
    # pseudocode: char_counter(array) = sum(array[0]) + char_counter(array[1, array.length - 1])
    sum = array[0].length
    # base case
    return sum if array.length == 1 # using array.length to get the length of an array
    return sum + char_counter(array[1, array.length - 1])
end

array = ['ab', 'c', 'def', 'ghij']
sum = char_counter(array)
puts sum
</code></pre>
<p>The soluton given in the book:</p>
<pre><code class="language-Ruby">def character_count(array)
    return 0 if array.length == 0
    return array[0].length + character_count(array[1, array.length - 1])
end
</code></pre>
<h4 id="Exercise-2"><a class="headerlink" href="#Exercise-2" title="Exercise 2"></a>Exercise 2</h4><p>Use recursion to write a function that accepts an array of strings and returns the total numbers of characters across all the strings.<br/>My solution:</p>
<pre><code class="language-Ruby">def get_even_numbers(array, even_numbers=[])
    # pseudocode: 
    # if array[0] is even, save it into an array
    # get_even_numbers(array[1, array.length - 1])
    if array[0] % 2 == 0
        even_numbers &lt;&lt; array[0]
    end
    # base case
    if array.length == 1
        return even_numbers
    end
    return get_even_numbers(array[1, array.length - 1], even_numbers)
end

array = [1,2,3,4,5,6,12,14,15,16,33,42,53]
even_numbers = get_even_numbers(array)
puts even_numbers
</code></pre>
<p>The soluton given in the book:<br/>First, let’s pretend the <code>select_even</code> function already works. Next, let’s identify the subproblem: if we try to select all the even numbers in an array, <code>[1, 2, 3, 4, 5]</code>, the subproblem would be <code>select_even([2, 3, 4, 5])</code> which returns <code>[2, 4]</code>. Finally, add the base case which returns <code>[]</code> under the situation where there are not any element in the array .</p>
<pre><code class="language-Ruby">def select_even(array)
    return [] if array.empty?
    
    if array[0].even?
        return [array[0]] + select_even(array[1, array.length - 1])
    else
        return select_even(array[1, array.length - 1])
    end
end
</code></pre>
<h4 id="Exercise-3"><a class="headerlink" href="#Exercise-3" title="Exercise 3"></a>Exercise 3</h4><p>Write a function that acceptsa a number for N and returns the correct number from the “Triangular Numbers” series. The pattern begins as 1, 3, 6, 10, 15, 21, and continues onward with the Nth number in the pattern, which is N plus the previous number. For example, <code>3=1+2</code>, <code>6=3+3</code>, <code>10=6+4</code>.<br/>My solution:</p>
<pre><code class="language-Ruby">def get_triangular_number(n)
    # 1. assume that someone else has already implemented this function, 
    # I only need the return value: Nth number would be N + (N-1)th
    # 2. identify the subproblem: get the (N-1)th number from the "Triangular Numbers"
    # 3. add the base case

    # base case
    return 1 if n == 1
    # Nth number = N + (N-1)th
    return n + get_triangular_number(n - 1)
end

puts get_triangular_number(6)
</code></pre>
<h4 id="Exercise-4"><a class="headerlink" href="#Exercise-4" title="Exercise 4"></a>Exercise 4</h4><p>Use recurtion to write a function that accepts a string and returns the first index that contains the character ‘x’. To keep things simple, assume that the string has at least one ‘x’.<br/>My solution:</p>
<pre><code class="language-Ruby">def get_index_of_x(string)
    # 1. assume that someone has already finished this function and returns that index.
    # 2. identify the subproblem: the function that returns the first index that contains the character 'x', 
    # which accepts a sub string of the original ranging from index $1$ to index $length - 1$
    # 3. add the base case: when we have found the index of 'x'

    # base case 
    return 0 if string[0] == 'x'
    # plus one since we have moved the first character every time we recursively call the function
    return get_index_of_x(string[1, string.length - 1]) + 1 
end

string = 'abcdefghijklmnopqrstuvwxyz'
puts get_index_of_x(string)
</code></pre>
<h4 id="Exercise-5"><a class="headerlink" href="#Exercise-5" title="Exercise 5"></a>Exercise 5</h4><p>the “Unique paths” problem: you have a grid of rows and columns. Write a function that accepts a number of rows and a number of columns, and calculates the number of possible “shortest” paths from the upper-leftmost square to the lower-rightmost square.<br/>My solution:</p>
<pre><code class="language-Ruby">def unique_paths_problem(number_of_rows, number_of_columns)
    # 1. assume that the function has been implemented. It would return the number of possible paths.
    # 2. identify the subproblem of this problem: you've already moved one step to the right, or one step downward, 
    # and you are supposed to calculate the rest number of possible paths 
    # by `unique_paths_problem(number_of_rows - 1, number_of_columns)` or `unique_paths_problem(number_of_rows, number_of_columns - 1)`. 
    # The total number of possible paths would be the sum of the number of moving to the right and the number of moving downward.
    # However, you would also have to consider the situation in which you have moved to the edge of the bottom side and the right side.
    # 3. add the base case

    # base case
    return 1 if number_of_rows == 1 &amp;&amp; number_of_columns == 1
    return unique_paths_problem(number_of_rows, number_of_columns - 1) if number_of_rows == 1
    return unique_paths_problem(number_of_rows - 1, number_of_columns) if number_of_columns == 1
    return unique_paths_problem(number_of_rows - 1, number_of_columns) + 
            unique_paths_problem(number_of_rows, number_of_columns - 1)
end

puts unique_paths_problem(3, 7)
</code></pre>
<p>The soluton given in the book:</p>
<pre><code class="language-Ruby">def unique_paths_problem(rows, columns)
    return 1 if rows == 1 || columns == 1
    return unique_paths_problem(rows - 1, columns) + unique_paths_problem(rows, columns - 1)
end

puts unique_paths_problem(3, 7)
</code></pre>
<hr/>
<h1 id="Chapter-12-Dynamic-Programming"><a class="headerlink" href="#Chapter-12-Dynamic-Programming" title="Chapter 12. Dynamic Programming"></a>Chapter 12. Dynamic Programming</h1><div style="text-align: center"><h3>Overlapping Subproblems</h3></div>
<p>The following code returns the Nth number in the Fibonacci sequence. </p>
<pre><code class="language-Python">def fib(n):
    if n == 0 or n == 1:
        return n
    return fib(n - 2) + fib(n - 1)
</code></pre>
<p>It has an efficiency of $O(2^N)$ which is unexpected. The reason why it happened is because the recursive functions are repeatedly calculating several Fibonicci numbers such as fib(0) for multiple times. The smaller the number is, the more times the functions are called.</p>
<div style="text-align: center"><h3>Memoization</h3></div>
<p>One way to optimize the speed of this function is using memoization. We can store every result of <code>fib(n)</code> into a hash table. Before we call <code>fib(n)</code>, it first checks that hash table to see if the the results of <code>fib(n)</code> has already been computed. Only if the 3 key is NOT in the hash table does the function proceed to call <code>fib(3)</code>.</p>
<pre><code class="language-Python">def fib(n, memo):
    if n == 0 or n == 1:
        return n
    if not memo.get(n):
        memo[n] = fib(n - 2, memo) + fib(n - 1, memo)
    return memo[n]
</code></pre>
<p>Memoization will raise the speed of this function up to $(2N)-1$, that is, an $O(N)$ algorithms.</p>
<div style="text-align: center"><h3>Going Bottom-up</h3></div>
<p>The another way is that we start solving this problem with the first two Fibonacci numbers: 0 and 1. Then, use the iteration to build up the sequence.</p>
<pre><code class="language-Python">def fib(n)
    if n == 0
        return 0
    a = 0
    b = 1
    for i in range(1, n):
        temp = a
        a = b;
        b = temp + a
    return b
</code></pre>
<p>Since the loop is from 1 to N, this code takes N steps, so it’s $O(N)$.</p>
<h3 id="Exercise-3"><a class="headerlink" href="#Exercise-3" title="Exercise"></a>Exercise</h3><h4 id="Exercise-1-1"><a class="headerlink" href="#Exercise-1-1" title="Exercise 1"></a>Exercise 1</h4><p>Fix the code to eliminate the unnecessary recursion</p>
<pre><code class="language-Ruby">def add_until_100(array, function_calling_counter=0)
    puts "add_until_100" # outputs 31 times for the case array = [23, 1, 99, 22]
    return 0 if array.length == 0
    if array[0] + add_until_100(array[1, array.length - 1]) &gt; 100
        return add_until_100(array[1, array.length - 1])
    else
        return array[0] + add_until_100(array[1, array.length - 1])
    end
end
</code></pre>
<p>My solution:</p>
<pre><code class="language-Ruby">def add_until_100_memoization(array, index=0, hash_table={})
    puts "add_until_100" # outputs 5 times for the case array = [23, 1, 99, 22]
    return 0 if array.length == 0
    # Split array[0] + add_until_100(array[1, array.length - 1]) &gt; 100 into three parts:
    # array[0], add_until_100(array[1, array.length - 1]) and &gt; 100
    # Only implement the memoization on the result of recursive function
    if hash_table[index] == nil
        hash_table[index] = add_until_100_memoization(array[1, array.length - 1], index + 1, hash_table)
    end
    # Do the summation and comparison later
    sum = array[0] + hash_table[index]
    if sum &gt; 100
        return hash_table[index]
    else
        return sum
    end
end
</code></pre>
<p>Answer:</p>
<pre><code class="language-Ruby">def add_until_100_answer(array)
    puts "add_until_100" # outputs 5 times for the case array = [23, 1, 99, 22]
    return 0 if array.length == 0
    sum_of_remaining_numbers = add_until_100_answer(array[1, array.length - 1])
    if array[0] + sum_of_remaining_numbers &gt; 100
        return sum_of_remaining_numbers
    else
        return array[0] + sum_of_remaining_numbers
    end
end
</code></pre>
<h4 id="Exercise-2-1"><a class="headerlink" href="#Exercise-2-1" title="Exercise 2"></a>Exercise 2</h4><p>The following function uses recursion to calculate the Nth number from “Golomb sequence”. Fix the code to eliminate the unnecessary recursion</p>
<pre><code class="language-Ruby">def golomb(n)
    puts "golomb" # once for golomb(1), 4 times for golomb(2), 10 times for golomb(3), 19 times for golomb(4)
    return 1 if n == 1
    return 1 + golomb(n - golomb(golomb(n - 1)))
end
</code></pre>
<p>My solution:</p>
<pre><code class="language-Ruby">def golomb_memoization(n, hash_table={})
    puts "golomb" # once for golomb(1), 4 times for golomb(2), 7 times for golomb(3), 10 times for golomb(4)
    return 1 if n == 1
    if hash_table[n] == nil # Or !hash_table[n]
        hash_table[n] = 1 + golomb_memoization(n - golomb_memoization(golomb_memoization(n - 1, hash_table), hash_table), hash_table)
    end
    return hash_table[n]
end
</code></pre>
<h4 id="Exercise-3-1"><a class="headerlink" href="#Exercise-3-1" title="Exercise 3"></a>Exercise 3</h4><p>Here is a solution to the “Unique Paths” problem from an exercise in the previous chapter. Fix the code to eliminate the unnecessary recursion</p>
<pre><code class="language-Ruby">def unique_paths(rows, columns)
    # puts "unique_paths" # outputs 55 times for unique_paths(3, 7)
    return 1 if rows == 1 || columns == 1
    return unique_paths(rows - 1, columns) + unique_paths(rows, columns - 1)
end
</code></pre>
<p>My solution:</p>
<pre><code class="language-Ruby">def unique_paths_memoization(rows, columns, hash_table={})
    puts "unique_paths_memoization" # outputs 25 times for unique_paths_memoization(3, 7)
    return 1 if rows == 1 || columns == 1
    if hash_table[[rows, columns]] == nil # Or !hash_table[[rows, columns]]
        hash_table[[rows, columns]] = unique_paths_memoization(rows - 1, columns, hash_table) + unique_paths_memoization(rows, columns - 1, hash_table)
    end
    return hash_table[[rows, columns]]
end
</code></pre>
<hr/>
