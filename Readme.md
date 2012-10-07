# inline-edit

Make any element editable.  If the element is already an input it will just be styled to blend in with the page, otherwise it will be made editable, and start firing events as if it were an input.

## API

### inlineEdit(el)
Make `el` editable, and provides an interface similar to a normal input.  `change` events will be triggered if the content changes, and the content can be accessed either with `el.value` or `el.getAttribute('value')`.

Unlike a normal input, these elements will not be submitted with a form post.

## Example
    
    inlineEdit = require('inline-edit');
    var el = document.getElementById('content');
    inlineEdit(el);
    
    el.addEventListener('change', function(event){ 
      console.log('Element Changed:', event);
      console.log('New Value:', event.target.value);
    });
    
## License 
MIT