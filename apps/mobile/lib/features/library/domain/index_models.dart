class AppIndex {
  AppIndex({
    required this.appVersion,
    required this.generatedAt,
    required this.semesters,
  });

  final String appVersion;
  final String generatedAt;
  final List<Semester> semesters;

  factory AppIndex.fromJson(Map<String, dynamic> json) {
    final semestersJson = (json['semesters'] as List<dynamic>? ?? []);
    return AppIndex(
      appVersion: (json['appVersion'] ?? '1.0.0').toString(),
      generatedAt: (json['generatedAt'] ?? '').toString(),
      semesters: semestersJson
          .map((e) => Semester.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class Semester {
  Semester({required this.name, required this.subjects});
  final String name;
  final List<Subject> subjects;

  factory Semester.fromJson(Map<String, dynamic> json) {
    final subjectsJson = (json['subjects'] as List<dynamic>? ?? []);
    return Semester(
      name: (json['name'] ?? '').toString(),
      subjects: subjectsJson
          .map((e) => Subject.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class Subject {
  Subject({required this.name, required this.sections});
  final String name;
  final List<Section> sections;

  factory Subject.fromJson(Map<String, dynamic> json) {
    final sectionsJson = (json['sections'] as List<dynamic>? ?? []);
    return Subject(
      name: (json['name'] ?? '').toString(),
      sections: sectionsJson
          .map((e) => Section.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class Section {
  Section({required this.name, required this.items});
  final String name;
  final List<LibraryItem> items;

  factory Section.fromJson(Map<String, dynamic> json) {
    final itemsJson = (json['items'] as List<dynamic>? ?? []);
    return Section(
      name: (json['name'] ?? '').toString(),
      items: itemsJson
          .map((e) => LibraryItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class LibraryItem {
  LibraryItem({
    required this.id,
    required this.title,
    required this.type,
    required this.url,
    required this.hash,
    required this.updatedAt,
    required this.sizeBytes,
  });

  final String id;
  final String title;
  final String type;
  final String url;
  final String hash;
  final String updatedAt;
  final int sizeBytes;

  factory LibraryItem.fromJson(Map<String, dynamic> json) {
    return LibraryItem(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      type: (json['type'] ?? 'html_doc').toString(),
      url: (json['url'] ?? '').toString(),
      hash: (json['hash'] ?? '').toString(),
      updatedAt: (json['updatedAt'] ?? '').toString(),
      sizeBytes: (json['sizeBytes'] ?? 0) is int
          ? json['sizeBytes'] as int
          : int.tryParse((json['sizeBytes'] ?? '0').toString()) ?? 0,
    );
  }
}
