# Super Bookmarkleter

This is a fork of chriszarate's original [bookmarkleter][original-gh] with some additional features.

- Preserve %s for [Chrome site search][chrome-site-search-doc]

# Bookmarkleter

You have JavaScript. You need a [bookmarklet][bookmarklet]. This does that.

## Browser tool

Create bookmarklets in your browser with a simple copy and paste.

**https://chriszarate.github.io/bookmarkleter/**

## Options

All options are Boolean flags.

  * `urlencode` (default `true`): URL-encode reserved characters: \[space\], %,
    ", <, >, #, @, &, ?

  * `iife` (default `false`): Wrap in an [IIFE][iife] (anonymizing function) to
    prevent exposing variables to the page on which the bookmarklet is running.

  * `mangleVars` (default `false`): Mangle variable names and other tokens to
    further reduce size.

  * `transpile` (default `false`): Transpile for browsers using [Babel][babel].

  * `jQuery` (default `false`): Make sure a modern version (>= 1.7) of
    [jQuery][jquery] is available for your code.

## License

This is free software. It is released to the public domain without warranty.


[bookmarklet]: http://en.wikipedia.org/wiki/Bookmarklet "Wikipedia entry on Bookmarklets"
[iife]: http://en.wikipedia.org/wiki/Immediately-invoked_function_expression "Immediately invoked function expression"
[babel]: https://babeljs.io
[babel-minify]: https://github.com/babel/minify
[jquery]: http://jquery.com
[original-gh]: https://github.com/chriszarate/bookmarkleter
[chrome-site-search-doc]:https://support.google.com/chrome/answer/95426#zippy=%2Curl-with-s-in-place-of-query-field