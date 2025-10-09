/**
 * ESLint rule to ensure all buttons have SiteForge hover effects
 * Add this to your .eslintrc.js file
 */

module.exports = {
  rules: {
    // Custom rule to check for button hover effects
    "siteforge/button-hover-effect": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Ensure all buttons have SiteForge hover effects",
          category: "Best Practices",
          recommended: true
        },
        fixable: "code",
        schema: []
      },
      create(context) {
        return {
          JSXElement(node) {
            // Check if it's a Button component
            if (node.openingElement.name.name === 'Button') {
              const className = node.openingElement.attributes.find(
                attr => attr.name && attr.name.name === 'className'
              );
              
              if (className && className.value) {
                const classValue = className.value.value || '';
                
                // Check if hover effect classes are present
                const hasHoverEffect = 
                  classValue.includes('hover:bg-gradient-to-r') ||
                  classValue.includes('hover:from-blue-700') ||
                  classValue.includes('hover:to-blue-800') ||
                  classValue.includes('hover:text-white');
                
                if (!hasHoverEffect) {
                  context.report({
                    node,
                    message: 'Button should have SiteForge hover effect classes. Add: hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white',
                    fix(fixer) {
                      const currentClass = className.value.value || '';
                      const newClass = currentClass 
                        ? `${currentClass} hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white`
                        : 'hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white';
                      
                      return fixer.replaceText(
                        className.value,
                        `"${newClass}"`
                      );
                    }
                  });
                }
              }
            }
          }
        };
      }
    }
  }
};
