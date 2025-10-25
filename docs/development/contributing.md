# Contributing to MedBot

Thank you for your interest in contributing to MedBot! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Let us know!
- ✨ **Feature Requests**: Have an idea? Share it!
- 📝 **Documentation**: Improve or add documentation
- 💻 **Code**: Submit bug fixes or new features
- 🧪 **Testing**: Help test new features
- 🎨 **Design**: Improve UI/UX
- 🌍 **Translation**: Add language support

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/medbot.git
cd medbot
```

### 2. Set Up Development Environment

```bash
# Backend setup
cd medbot-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../medbot-frontend
npm install
```

### 3. Create a Branch

```bash
# Create a descriptive branch name
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📋 Contribution Guidelines

### Code Style

#### Python (Backend)

**Follow PEP 8:**

```python
# Good
def transcribe_audio(file_path: str) -> dict:
    """Transcribe audio file using Whisper.
    
    Args:
        file_path: Path to audio file
        
    Returns:
        dict: Transcription result
    """
    result = model.transcribe(file_path)
    return result

# Bad
def TranscribeAudio(filePath):
    result=model.transcribe(filePath)
    return result
```

**Use Type Hints:**
```python
from typing import Dict, List, Optional

def process_segments(segments: List[Dict]) -> str:
    ...
```

**Error Handling:**
```python
try:
    result = risky_operation()
except SpecificException as e:
    logger.error(f"Operation failed: {str(e)}")
    raise HTTPException(status_code=500, detail=str(e))
```

#### TypeScript (Frontend)

**Use TypeScript Features:**

```typescript
// Good
interface TranscriptionData {
  text: string;
  speakers?: string[];
}

const handleTranscription = (data: TranscriptionData): void => {
  console.log(data.text);
};

// Bad
const handleTranscription = (data) => {
  console.log(data.text);
};
```

**Component Structure:**

```typescript
// Good
export default function ComponentName({ prop1, prop2 }: Props) {
  const [state, setState] = useState<string>("");
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**Use Async/Await:**
```typescript
const fetchData = async () => {
  try {
    const response = await axios.post(url, data);
    setResult(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Commit Messages

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**

```bash
feat(transcription): add support for MP4 audio files

- Added MP4 format detection
- Implemented audio conversion to WAV
- Updated documentation

Closes #123
```

```bash
fix(diarization): resolve speaker labeling issue

Fixed bug where speakers were incorrectly assigned when
audio had long silences between speech segments.

Fixes #456
```

### Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add/update code comments
   - Update relevant docs

2. **Test Your Changes**
   - Test locally
   - Check for regressions
   - Verify edge cases

3. **Create Pull Request**
   - Clear title and description
   - Reference related issues
   - Include screenshots if UI changes
   - List breaking changes if any

4. **PR Description Template**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added new tests
- [ ] All tests passing

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Closes #123
Related to #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
```

## 🐛 Reporting Bugs

### Before Submitting

1. Check [existing issues](../../issues)
2. Try [troubleshooting steps](../troubleshooting.md)
3. Test with latest version

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[If applicable]

## Environment
- OS: [e.g., macOS 13.0]
- Python: [e.g., 3.9.7]
- Node: [e.g., 18.0.0]
- Browser: [e.g., Chrome 120]

## Error Messages
```
Paste error messages here
```

## Additional Context
Any other relevant information
```

## ✨ Requesting Features

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this address?

## Proposed Solution
How should it work?

## Alternatives Considered
Other solutions you've thought about

## Additional Context
Screenshots, mockups, examples, etc.
```

## 🧪 Testing

### Backend Testing

```bash
cd medbot-api

# Test transcription
python test_transcription.py

# Test diarization
python test_diarization.py
```

### Frontend Testing

```bash
cd medbot-frontend

# Run tests (when implemented)
npm test

# Build test
npm run build
```

### Manual Testing Checklist

- [ ] Audio recording works
- [ ] File upload works
- [ ] Transcription completes
- [ ] Speaker diarization labels correctly
- [ ] Clinical note generates
- [ ] Copy buttons work
- [ ] Error messages display properly
- [ ] Loading states show correctly

## 📚 Documentation

### What to Document

- New features
- API changes
- Configuration options
- Breaking changes
- Migration guides

### Documentation Style

```markdown
# Clear Title

Brief introduction paragraph.

## Section Heading

Explanation with examples:

```bash
# Command example
npm run dev
```

**Important notes in bold**

- Bullet points for lists
- Keep it concise
- Use code blocks for code
```

## 🎨 UI/UX Guidelines

### Design Principles

1. **Simplicity**: Clean, intuitive interface
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Responsiveness**: Mobile-friendly
4. **Consistency**: Follow existing patterns
5. **Feedback**: Clear user feedback

### Component Guidelines

```typescript
// Use consistent naming
<Button variant="primary" size="large">
  Click Me
</Button>

// Use Tailwind classes consistently
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  ...
</div>
```

### Color Scheme

```css
/* Primary Colors */
--primary: #4F46E5;      /* Indigo */
--secondary: #10B981;    /* Green */
--accent: #F59E0B;       /* Amber */

/* Semantic Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

## 🔍 Code Review Process

### What We Look For

- ✅ Code quality and clarity
- ✅ Test coverage
- ✅ Documentation
- ✅ Performance
- ✅ Security
- ✅ Accessibility
- ✅ Browser compatibility

### Review Timeline

- Initial review: 2-3 days
- Feedback incorporated: 1-2 days
- Final approval: 1 day
- Merge: Same day

## 🏗️ Project Structure

```
medbot/
├── medbot-api/              # Backend
│   ├── index.py            # Main API file
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment template
├── medbot-frontend/         # Frontend
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   └── package.json        # Node dependencies
└── docs/                   # Documentation
    ├── api/               # API documentation
    └── guides/            # User guides
```

## 🎯 Priority Areas

### High Priority

- 🔴 Bug fixes
- 🔴 Security improvements
- 🔴 Performance optimizations
- 🔴 Documentation

### Medium Priority

- 🟡 New features
- 🟡 UI improvements
- 🟡 Code refactoring

### Low Priority

- 🟢 Nice-to-have features
- 🟢 Code cleanup
- 🟢 Minor optimizations

## 💬 Communication

### Channels

- **GitHub Issues**: Bug reports, features
- **Pull Requests**: Code contributions
- **Discussions**: General questions
- **Email**: Private matters

### Response Time

- Issues: 1-2 days
- PRs: 2-3 days
- Questions: 1-2 days

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## ❓ Questions?

- Check the [FAQ](../faq.md)
- Read the [documentation](../README.md)
- Ask in GitHub Discussions
- Open an issue

---

## 📋 Quick Checklist

Before submitting your contribution:

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] Tests added/passing
- [ ] No new warnings
- [ ] Branch is up to date with main
- [ ] Descriptive commit messages
- [ ] PR description complete

---

**Thank you for contributing to MedBot!** 🎉

Every contribution, no matter how small, helps make MedBot better for everyone.

