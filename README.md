# XSS attack demo app

Unsafe Twitter-like website to show XSS attacks

insipred by [TweetDeck XSS Tweet](https://dev.to/ben/my-all-time-favorite-demonstration-of-a-cross-site-scripting-attack)

## Example attack

```<script>$('a')[0].click();</script>```

## Mitigation

### Client side validation

#### items.handlebars

- Raw Input (XSS): ```<p class="m-0">{{{ this.Text }}}</p>```
- Escaped: ```<p class="m-0">{{ this.Text }}</p>```

### Server side

#### server.js

TODO
